import Chat from "../models/chat.model.js";
import Message from "../models/message.model.js";
import cloudinary from "../config/cloudinary.js";

export const sendMessage = async (req, res, next) => {
  try {
    const userId = req.user._id;
    const { chatId, content, image, replyToId } = req.body;

    const chat = await Chat.findOne({
      _id: chatId,
      participants: { $in: [userId] },
    });
    if (!chat) {
      const error = new Error("Chat not found");
      error.statusCode = 404;
      throw error;
    }

    if (replyToId) {
      const replyMessage = await Message.findOne({
        _id: replyToId,
        chatId,
      });
      if (!replyMessage) {
        const error = new Error("Message not found");
        error.statusCode = 404;
        throw error;
      }
    }

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
      { path: "sender", select: "name avatar" },
      {
        path: "replyTo",
        select: "content image sender",
        populate: {
          path: "sender",
          select: "name avatar",
        },
      },
    ]);

    chat.lastMessage = newMessage._id;
    await chat.save();

    res.status(200).json({
      success: true,
      message: "Message sent successfully",
      userMessage: newMessage,
      chat,
    });
  } catch (error) {
    next(error);
  }
};
