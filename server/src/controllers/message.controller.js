import Chat from "../models/chat.model.js";
import Message from "../models/message.model.js";
import cloudinary from "../config/cloudinary.js";
import { emitNewMessageToChat } from "../lib/socket.js";

export const sendMessage = async (req, res, next) => {
  try {
    const userId = req.user._id;
    const { chatId, content, image, replyToId } = req.body;

    const chat = await Chat.findOne({
      _id: chatId,
      participants: { $in: [userId] },
    });
    if (!chat) return res.status(404).json({ message: "Chat not found" });

    let imageUrl;
    if (image) {
      const uploadRes = await cloudinary.uploader.upload(image);
      imageUrl = uploadRes.secure_url;
    }

    const newMessage = await Message.create({
      chatId,
      sender: userId,
      content,
      image: imageUrl,
      replyTo: replyToId || null,
    });

    await newMessage.populate([
      { path: "sender", select: "firstName lastName avatar" },
      {
        path: "replyTo",
        select: "content image sender",
        populate: { path: "sender", select: "firstName lastName avatar" },
      },
    ]);

    chat.lastMessage = newMessage._id;
    await chat.save();

    emitNewMessageToChat(chat.participants, newMessage, userId);

    res.status(201).json({
      message: "Message sent successfully",
      newMessage,
    });
  } catch (error) {
    next(error);
  }
};
