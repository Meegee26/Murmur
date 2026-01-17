import { emitNewChatToParticipants } from "../lib/socket.js";
import Chat from "../models/chat.model.js";
import Message from "../models/message.model.js";
import User from "../models/user.model.js";

export const createChat = async (req, res, next) => {
  try {
    const userId = req.user._id;
    const { participantId, isGroup, participants, groupName } = req.body;

    let chat;
    let allParticipantIds = [];

    if (isGroup && participants?.length && groupName) {
      allParticipantIds = [userId, ...participants];
      chat = await Chat.create({
        participants: allParticipantIds,
        isGroup: true,
        groupName,
        createdBy: userId,
      });
    } else if (participantId) {
      const otherUser = await User.findById(participantId);
      if (!otherUser)
        return res.status(404).json({ message: "User not found" });

      allParticipantIds = [userId, participantId];
      const existingChat = await Chat.findOne({
        participants: {
          $all: allParticipantIds,
          $size: 2,
        },
      }).populate("participants", "firstName lastName avatar");

      if (existingChat) return res.status(200).json({ chat: existingChat });

      chat = await Chat.create({
        participants: allParticipantIds,
        createdBy: userId,
      });
    } else {
      return res.status(400).json({ message: "Invalid chat details provided" });
    }

    const populatedChat = await chat.populate(
      "participants",
      "firstName lastName avatar",
    );

    emitNewChatToParticipants(allParticipantIds, populatedChat);

    res.status(201).json({
      message: "Chat created successfully",
      chat: populatedChat,
    });
  } catch (error) {
    next(error);
  }
};

export const getUserChats = async (req, res, next) => {
  try {
    const userId = req.user._id;
    const chats = await Chat.find({
      participants: { $in: [userId] },
    })
      .populate("participants", "firstName lastName avatar isDev")
      .populate({
        path: "lastMessage",
        populate: { path: "sender", select: "firstName lastName avatar isDev" },
      })
      .sort({ updatedAt: -1 });

    res.status(200).json({ message: "Chats retrieved successfully", chats });
  } catch (error) {
    next(error);
  }
};

export const getSingleChat = async (req, res, next) => {
  try {
    const userId = req.user._id;
    const { id: chatId } = req.params;

    const chat = await Chat.findOne({
      _id: chatId,
      participants: { $in: [userId] },
    }).populate("participants", "firstName lastName avatar isDev");

    if (!chat) return res.status(404).json({ message: "Chat not found" });

    const messages = await Message.find({ chatId })
      .populate("sender", "firstName lastName avatar isDev")
      .populate({
        path: "replyTo",
        select: "content image sender",
        populate: { path: "sender", select: "firstName lastName avatar isDev" },
      })
      .sort({ createdAt: 1 });

    res.status(200).json({ chat, messages });
  } catch (error) {
    next(error);
  }
};

export const markChatAsRead = async (req, res, next) => {
  try {
    const userId = req.user._id;
    const { id: chatId } = req.params;

    const chat = await Chat.findById(chatId);
    if (!chat) return res.status(404).json({ message: "Chat not found" });

    chat.lastRead.set(userId.toString(), new Date());
    await chat.save();

    res.status(200).json({ message: "Chat marked as read" });
  } catch (error) {
    next(error);
  }
};
