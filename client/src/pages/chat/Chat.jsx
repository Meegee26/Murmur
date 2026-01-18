import {
  Box,
  Stack,
  Group,
  Avatar,
  Text,
  TextInput,
  ActionIcon,
  ScrollArea,
  Indicator,
  Tooltip,
  Image,
  Loader,
  Center,
  Title,
  ThemeIcon,
  UnstyledButton,
  Modal,
  Button,
  MultiSelect,
  Checkbox,
  Badge,
  useMantineColorScheme,
  useComputedColorScheme,
  Menu,
} from "@mantine/core";
import { useDisclosure, useMediaQuery } from "@mantine/hooks";
import {
  IconSearch,
  IconSend,
  IconPhone,
  IconVideo,
  IconInfoCircle,
  IconLogout,
  IconPaperclip,
  IconMessageCircle2,
  IconMessages,
  IconPlus,
  IconUsers,
  IconUserPlus,
  IconSettings,
  IconSun,
  IconMoon,
  IconArrowLeft,
} from "@tabler/icons-react";
import { useState, useRef, useEffect, useMemo, useCallback } from "react";
import { io } from "socket.io-client";
import { useAuth } from "../../hooks/useAuth.js";
import { api } from "../../utils/api.js";
import { useNavigate, useParams } from "react-router-dom";
import { notifications } from "@mantine/notifications";
import "@mantine/core/styles.css";
import "@mantine/notifications/styles.css";

const notificationSound = new Audio("/sounds/new-message.mp3");
notificationSound.preload = "auto";

export function Chat() {
  const { user, signOut } = useAuth();
  const { chatId } = useParams();
  const navigate = useNavigate();
  const isMobile = useMediaQuery("(max-width: 768px)");

  const { setColorScheme } = useMantineColorScheme();
  const colorScheme = useComputedColorScheme("light", {
    getInitialValueInEffect: true,
  });

  const [onlineUsers, setOnlineUsers] = useState([]);
  const [opened, { open, close }] = useDisclosure(false);

  const [activeChat, setActiveChat] = useState(null);
  const [chatList, setChatList] = useState([]);
  const [messages, setMessages] = useState([]);
  const [isLoadingChats, setIsLoadingChats] = useState(true);
  const [isLoadingMessages, setIsLoadingMessages] = useState(false);

  const [sidebarSearch, setSidebarSearch] = useState("");

  const [inputValue, setInputValue] = useState("");
  const [isSending, setIsSending] = useState(false);

  const [isGroup, setIsGroup] = useState(false);
  const [groupName, setGroupName] = useState("");
  const [selectedUsers, setSelectedUsers] = useState([]);
  const [globalUsers, setGlobalUsers] = useState([]);

  const viewport = useRef(null);
  const socket = useRef(null);

  useEffect(() => {
    if (!user) return;

    const socketUrl = import.meta.env.VITE_API_URL
      ? new URL(import.meta.env.VITE_API_URL).origin
      : "http://localhost:5500";

    socket.current = io(socketUrl, {
      query: { userId: user._id },
    });

    socket.current.on("getOnlineUsers", (users) => {
      setOnlineUsers(users);
    });

    socket.current.on("message:new", (newMessage) => {
      setChatList((prev) => {
        const chatIndex = prev.findIndex((c) => c._id === newMessage.chatId);
        if (chatIndex === -1) return prev;

        const updatedChat = { ...prev[chatIndex], lastMessage: newMessage };
        const newList = [...prev];
        newList.splice(chatIndex, 1);
        newList.unshift(updatedChat);
        return newList;
      });
    });

    socket.current.on("chat:new", (newChat) => {
      setChatList((prev) => {
        if (prev.find((c) => c._id === newChat._id)) return prev;
        return [newChat, ...prev];
      });
    });

    return () => socket.current?.disconnect();
  }, [user]);

  const handleChatSelect = useCallback(
    async (chat) => {
      navigate(`/chat/${chat._id}`);
      setActiveChat(chat);

      try {
        await api.markAsRead(chat._id);

        setChatList((prevList) =>
          prevList.map((c) =>
            c._id === chat._id
              ? {
                  ...c,
                  lastRead: {
                    ...c.lastRead,
                    [user._id]: new Date().toISOString(),
                  },
                }
              : c,
          ),
        );
      } catch (err) {
        console.error("Error marking chat as read:", err);
      }
    },
    [navigate, user?._id],
  );

  const handleBackToChats = () => {
    navigate("/chat");
    setActiveChat(null);
  };

  useEffect(() => {
    if (!socket.current) return;

    const handleNewMessage = (newMessage) => {
      notificationSound.play().catch((err) => {
        console.warn("Autoplay prevented: ", err);
      });

      if (newMessage.chatId !== chatId) {
        const targetChat = chatList.find((c) => c._id === newMessage.chatId);
        const senderName = `${newMessage.sender?.firstName} ${newMessage.sender?.lastName}`;
        const senderAvatar = newMessage.sender?.avatar;

        notifications.show({
          title: (
            <Group justify="space-between" wrap="nowrap" gap="xs">
              <Text size="sm" fw={700} truncate style={{ maxWidth: "80%" }}>
                {targetChat?.isGroup
                  ? `[${targetChat.groupName}] ${senderName}`
                  : senderName}
              </Text>
              <Text size="xs" c="dimmed">
                Just now
              </Text>
            </Group>
          ),
          message: (
            <Stack gap={4} mt={5}>
              <Text size="sm" lineClamp={2} c="gray.7">
                {newMessage.content ||
                  (newMessage.image ? "Sent an image" : "")}
              </Text>
            </Stack>
          ),
          icon: (
            <Avatar src={senderAvatar} size="sm" radius="xl" color="violet">
              {newMessage.sender?.firstName?.[0]}
            </Avatar>
          ),
          color: "violet",
          radius: "md",
          withBorder: true,
          onClick: () => {
            handleChatSelect(targetChat || { _id: newMessage.chatId });
          },
          style: {
            cursor: "pointer",
            boxShadow: "var(--mantine-shadow-md)",
          },

          autoClose: 5000,
        });
      }

      if (newMessage.chatId === chatId) {
        setMessages((prev) => {
          if (prev.find((m) => m._id === newMessage._id)) return prev;
          return [...prev, newMessage];
        });
      }

      setChatList((prev) => {
        const chatIndex = prev.findIndex((c) => c._id === newMessage.chatId);
        if (chatIndex === -1) return prev;

        const updatedChat = { ...prev[chatIndex], lastMessage: newMessage };
        const newList = [...prev];
        newList.splice(chatIndex, 1);
        newList.unshift(updatedChat);
        return newList;
      });
    };

    socket.current.on("message:new", handleNewMessage);
    return () => socket.current.off("message:new", handleNewMessage);
  }, [chatId, chatList, handleChatSelect]);

  useEffect(() => {
    if (chatId && chatList.length > 0) {
      const found = chatList.find((c) => c._id === chatId);
      if (found) {
        setActiveChat(found);
      }
    } else if (!chatId) {
      setActiveChat(null);
    }
  }, [chatId, chatList]);

  useEffect(() => {
    const fetchChats = async () => {
      try {
        const data = await api.getUserChats();
        setChatList(data.chats || []);
      } catch (error) {
        console.error("Failed to load chats", error);
      } finally {
        setIsLoadingChats(false);
      }
    };
    if (user) fetchChats();
  }, [user]);

  useEffect(() => {
    if (!activeChat) return;
    const fetchMessages = async () => {
      setIsLoadingMessages(true);

      try {
        const data = await api.getChatDetails(activeChat._id);
        setMessages(data.messages || []);
      } catch (error) {
        console.error("Failed to load messages", error);
        setMessages([]);
      } finally {
        setIsLoadingMessages(false);
      }
    };

    fetchMessages();
  }, [activeChat]);

  useEffect(() => {
    viewport.current?.scrollTo({
      top: viewport.current.scrollHeight,
      behavior: "smooth",
    });
  }, [messages]);

  const getChatMetadata = useCallback(
    (chat) => {
      if (!chat || !user)
        return {
          name: "Loading...",
          avatar: null,
          status: "offline",
          initials: "?",
          isDev: false,
        };

      if (chat.isGroup) {
        return {
          name: chat.groupName || "Group Chat",
          avatar: null,
          status: "group",
          initials: (chat.groupName || "G").charAt(0).toUpperCase(),
          isDev: false,
        };
      }

      const other = chat.participants.find((p) => p._id !== user._id);
      const isOnline = onlineUsers.includes(other?._id);

      return {
        name: other ? `${other.firstName} ${other.lastName}` : "Unknown User",
        avatar: other?.avatar || null,
        status: isOnline ? "Online" : "Offline",
        initials: other
          ? `${other.firstName.charAt(0)}${other.lastName.charAt(
              0,
            )}`.toUpperCase()
          : "?",
        isDev: other?.isDev || false,
      };
    },
    [user, onlineUsers],
  );

  const filteredChats = useMemo(() => {
    return chatList.filter((chat) => {
      const meta = getChatMetadata(chat);
      return meta.name.toLowerCase().includes(sidebarSearch.toLowerCase());
    });
  }, [chatList, sidebarSearch, getChatMetadata]);

  const handleGlobalSearch = async (query) => {
    if (query.length < 2) return;
    try {
      const res = await api.searchUsers(query);
      const formatted = res.data.map((u) => ({
        value: u._id,
        label: `${u.firstName} ${u.lastName} (${u.email})`,
      }));
      setGlobalUsers(formatted);
    } catch (err) {
      console.error("Global search error", err);
    }
  };

  const handleCreateChat = async () => {
    try {
      let payload;
      if (isGroup) {
        payload = { isGroup: true, groupName, participants: selectedUsers };
      } else {
        payload = { participantId: selectedUsers[0] };
      }

      const res = await api.createChat(payload);
      const chatData = res.chat;

      if (!chatList.find((c) => c._id === chatData._id)) {
        setChatList([chatData, ...chatList]);
      }

      setActiveChat(chatData);
      close();
      setIsGroup(false);
      setGroupName("");
      setSelectedUsers([]);
    } catch (err) {
      console.error("Failed to create chat", err);
    }
  };

  const handleSendMessage = async () => {
    if (!inputValue.trim() || !activeChat) return;
    const temp = inputValue;
    setInputValue("");
    setIsSending(true);

    try {
      const res = await api.sendMessage({
        chatId: activeChat._id,
        content: temp,
      });

      const newMessage = res.newMessage;

      setMessages((prev) => [...prev, newMessage]);

      setChatList((prev) => {
        const chatIndex = prev.findIndex((c) => c._id === newMessage.chatId);
        if (chatIndex === -1) return prev;

        const updatedChat = { ...prev[chatIndex], lastMessage: newMessage };
        const newList = [...prev];
        newList.splice(chatIndex, 1);
        newList.unshift(updatedChat);
        return newList;
      });
    } catch {
      setInputValue(temp);
    } finally {
      setIsSending(false);
    }
  };

  const activeChatMeta = useMemo(
    () => getChatMetadata(activeChat),
    [activeChat, getChatMetadata],
  );

  const showSidebar = !isMobile || !activeChat;
  const showChat = !isMobile || activeChat;

  return (
    <Box
      h="100dvh"
      w="100vw"
      style={{
        display: "flex",
        overflow: "hidden",
        position: "fixed",
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
      }}
    >
      {showSidebar && (
        <Box
          w={{ base: "100%", md: 360 }}
          style={{
            borderRight:
              "1px solid light-dark(var(--mantine-color-gray-2), var(--mantine-color-dark-4))",
            display: "flex",
            flexDirection: "column",
            backgroundColor:
              "light-dark(var(--mantine-color-white), var(--mantine-color-dark-7))",
            height: "100%",
          }}
        >
          <Box px="md" pt="md" pb="xs">
            <Group justify="space-between" mb="lg">
              <Group gap="xs" align="center">
                <Image
                  src="/images/icon.png"
                  alt="Murmur"
                  h={40}
                  w="auto"
                  style={{ display: "block" }}
                />
                <Text
                  fw={900}
                  size="xl"
                  variant="gradient"
                  gradient={{ from: "indigo.6", to: "violet.6" }}
                >
                  Murmur
                </Text>
              </Group>
              <Menu shadow="md" width={200} position="bottom-end" radius="md">
                <Menu.Target>
                  <ActionIcon variant="subtle" color="gray" size="lg">
                    <IconSettings size={22} />
                  </ActionIcon>
                </Menu.Target>
                <Menu.Dropdown>
                  <Menu.Label>Settings</Menu.Label>
                  <Menu.Item
                    leftSection={
                      colorScheme === "dark" ? (
                        <IconSun size={16} />
                      ) : (
                        <IconMoon size={16} />
                      )
                    }
                    onClick={() =>
                      setColorScheme(colorScheme === "dark" ? "light" : "dark")
                    }
                  >
                    {colorScheme === "dark" ? "Light Mode" : "Dark Mode"}
                  </Menu.Item>

                  <Menu.Divider />

                  <Menu.Item
                    color="red"
                    leftSection={<IconLogout size={16} />}
                    onClick={() => signOut()}
                  >
                    Logout
                  </Menu.Item>
                </Menu.Dropdown>
              </Menu>
            </Group>

            <Group gap="xs">
              <TextInput
                placeholder="Search conversations..."
                radius="xl"
                style={{ flex: 1 }}
                value={sidebarSearch}
                onChange={(e) => setSidebarSearch(e.target.value)}
                leftSection={<IconSearch size={16} />}
              />
              <ActionIcon
                variant="light"
                color="violet"
                radius="xl"
                size="lg"
                onClick={open}
              >
                <IconPlus size={20} />
              </ActionIcon>
            </Group>
          </Box>

          <ScrollArea style={{ flex: 1 }} type="scroll">
            {isLoadingChats ? (
              <Center mt="xl">
                <Loader size="sm" />
              </Center>
            ) : filteredChats.length === 0 ? (
              <Stack align="center" mt="xl" gap="xs" c="dimmed" px="md">
                <IconMessages size={32} opacity={0.5} />
                <Text size="sm" ta="center">
                  No chats found.
                </Text>
              </Stack>
            ) : (
              <Stack gap={4} px="sm" pb="md">
                {filteredChats.map((chat) => {
                  const meta = getChatMetadata(chat);
                  const isActive = activeChat?._id === chat._id;

                  const myLastRead = chat.lastRead
                    ? chat.lastRead[user?._id]
                    : null;

                  const isLastMessageFromOthers =
                    chat.lastMessage &&
                    chat.lastMessage.sender?._id !== user?._id;

                  const isUnread =
                    !isActive &&
                    isLastMessageFromOthers &&
                    (!myLastRead ||
                      new Date(chat.lastMessage.createdAt) >
                        new Date(myLastRead));

                  return (
                    <UnstyledButton
                      key={chat._id}
                      onClick={() => handleChatSelect(chat)}
                      p="sm"
                      style={{
                        borderRadius: "var(--mantine-radius-lg)",
                        backgroundColor: isActive
                          ? "light-dark(var(--mantine-color-violet-0), var(--mantine-color-dark-5))"
                          : "transparent",
                      }}
                    >
                      <Group wrap="nowrap">
                        <Indicator
                          color={
                            meta.status.toLowerCase() === "online"
                              ? "green.5"
                              : "gray.6"
                          }
                          disabled={chat.isGroup}
                          size={16}
                          offset={7}
                          position="bottom-end"
                          withBorder
                        >
                          <Avatar
                            src={meta.avatar}
                            radius="xl"
                            size="lg"
                            color="violet"
                          >
                            {meta.initials}
                          </Avatar>
                        </Indicator>
                        <Box style={{ flex: 1, overflow: "hidden" }}>
                          <Group justify="space-between" wrap="nowrap" gap="xs">
                            <Group
                              gap={6}
                              wrap="nowrap"
                              style={{ flex: 1, minWidth: 0 }}
                            >
                              <Text
                                fw={isUnread ? 900 : 500}
                                size="sm"
                                truncate
                                c={
                                  isUnread
                                    ? "light-dark(black, white)"
                                    : "inherit"
                                }
                              >
                                {meta.name}
                              </Text>
                              {meta.isDev && (
                                <Badge
                                  size="xs"
                                  variant="gradient"
                                  gradient={{
                                    from: "indigo.6",
                                    to: "cyan.6",
                                    deg: 45,
                                  }}
                                  styles={{
                                    label: {
                                      fontWeight: 800,
                                      letterSpacing: "0.5px",
                                    },
                                  }}
                                  tt="uppercase"
                                >
                                  DEV
                                </Badge>
                              )}

                              <Text
                                size="xs"
                                c="dimmed"
                                style={{ whiteSpace: "nowrap" }}
                              >
                                {chat.lastMessage?.createdAt
                                  ? new Date(
                                      chat.lastMessage.createdAt,
                                    ).toLocaleTimeString([], {
                                      hour: "2-digit",
                                      minute: "2-digit",
                                    })
                                  : chat.updatedAt &&
                                    new Date(chat.updatedAt).toLocaleTimeString(
                                      [],
                                      {
                                        hour: "2-digit",
                                        minute: "2-digit",
                                      },
                                    )}
                              </Text>
                            </Group>
                          </Group>
                          <Text
                            size="xs"
                            truncate
                            fw={isUnread ? 700 : 400}
                            c={isUnread ? "light-dark(black, white)" : "dimmed"}
                          >
                            {chat.lastMessage?.content || "New conversation"}
                          </Text>
                        </Box>
                      </Group>
                    </UnstyledButton>
                  );
                })}
              </Stack>
            )}
          </ScrollArea>
        </Box>
      )}

      {showChat && (
        <Box
          style={{
            flex: 1,
            display: "flex",
            flexDirection: "column",
            minHeight: 0,
            height: "100%",
            position: "relative",
          }}
        >
          {!activeChat ? (
            <Center
              style={{ flex: 1, flexDirection: "column" }}
              bg="light-dark(var(--mantine-color-gray-0), var(--mantine-color-dark-8))"
            >
              <ThemeIcon
                size={80}
                radius="100%"
                variant="light"
                color="violet"
                mb="md"
              >
                <IconMessageCircle2 size={40} />
              </ThemeIcon>
              <Title order={3} mb="xs">
                Welcome to Murmur!
              </Title>
              <Text c="dimmed" size="sm">
                Select a chat or start a new one to begin messaging
              </Text>
            </Center>
          ) : (
            <>
              <Box
                px={{ base: "md", md: "xl" }}
                h={60}
                style={{
                  borderBottom:
                    "1px solid light-dark(var(--mantine-color-gray-2), var(--mantine-color-dark-4))",
                  display: "flex",
                  alignItems: "center",
                  flexShrink: 0,
                  zIndex: 10,
                }}
              >
                <Group justify="space-between" w="100%">
                  <Group gap="sm">
                    <ActionIcon
                      variant="subtle"
                      color="gray"
                      size="lg"
                      hiddenFrom="md"
                      onClick={handleBackToChats}
                    >
                      <IconArrowLeft size={22} />
                    </ActionIcon>
                    <Avatar
                      src={activeChatMeta.avatar}
                      radius="xl"
                      size="md"
                      color="violet"
                    >
                      {activeChatMeta.initials}
                    </Avatar>
                    <Box>
                      <Group gap={6} align="center">
                        <Text fw={700} size="sm">
                          {activeChatMeta.name}
                        </Text>
                        {activeChatMeta.isDev && (
                          <Badge
                            variant="gradient"
                            gradient={{
                              from: "indigo.6",
                              to: "cyan.6",
                              deg: 45,
                            }}
                            size="xs"
                          >
                            DEVELOPER
                          </Badge>
                        )}
                      </Group>
                      <Text
                        size="xs"
                        fw={600}
                        c={
                          !activeChat.isGroup &&
                          activeChatMeta.status.toLowerCase() === "online"
                            ? "green"
                            : "dimmed"
                        }
                        style={{ textTransform: "capitalize" }}
                      >
                        {activeChat.isGroup
                          ? `${activeChat.participants.length} members`
                          : activeChatMeta.status}
                      </Text>
                    </Box>
                  </Group>
                </Group>
              </Box>

              <ScrollArea
                viewportRef={viewport}
                style={{
                  flex: 1,
                  minHeight: 0,
                }}
                p={{ base: "md", md: "xl" }}
                pb={{ base: 80, md: "xl" }}
                bg="light-dark(var(--mantine-color-gray-0), var(--mantine-color-dark-8))"
              >
                <Stack gap="md">
                  {isLoadingMessages && messages.length === 0 ? (
                    <Center h={200}>
                      <Stack align="center" gap="sm">
                        <Loader color="violet" size="xl" type="bars" />
                        <Text size="sm" c="dimmed" fw={500}>
                          Syncing your messages...
                        </Text>
                      </Stack>
                    </Center>
                  ) : messages.length === 0 ? (
                    <Center h={200}>
                      <Text c="dimmed">Say hello! 👋</Text>
                    </Center>
                  ) : (
                    messages.map((msg) => {
                      const isMe =
                        msg.sender?._id === user?._id ||
                        msg.sender === user?._id;
                      const senderInitials =
                        msg.sender?.firstName && msg.sender?.lastName
                          ? `${msg.sender.firstName.charAt(
                              0,
                            )}${msg.sender.lastName.charAt(0)}`.toUpperCase()
                          : (
                              msg.sender?.firstName?.charAt(0) || "?"
                            ).toUpperCase();
                      return (
                        <Group
                          key={msg._id}
                          justify={isMe ? "flex-end" : "flex-start"}
                          align="flex-end"
                          gap="xs"
                          wrap="nowrap"
                        >
                          {!isMe && (
                            <Avatar
                              src={msg.sender?.avatar}
                              radius="xl"
                              size="sm"
                              color="violet"
                              style={{ flexShrink: 0 }}
                            >
                              {senderInitials}
                            </Avatar>
                          )}

                          {isMe && (
                            <Text
                              size="11px"
                              fw={500}
                              c="light-dark(gray.6, gray.5)"
                              mb={4}
                              style={{ flexShrink: 0 }}
                            >
                              {new Date(msg.createdAt).toLocaleTimeString([], {
                                hour: "2-digit",
                                minute: "2-digit",
                              })}
                            </Text>
                          )}

                          <Box
                            maw={{ base: "75%", md: "65%" }}
                            p="10px 14px"
                            style={{
                              backgroundColor: isMe
                                ? "var(--mantine-color-violet-6)"
                                : "light-dark(var(--mantine-color-gray-2), var(--mantine-color-dark-6))",
                              borderRadius: "16px",
                              borderBottomRightRadius: isMe ? "4px" : "16px",
                              borderBottomLeftRadius: isMe ? "16px" : "4px",
                              border: isMe
                                ? "none"
                                : "1px solid light-dark(var(--mantine-color-gray-3), var(--mantine-color-dark-4))",
                            }}
                          >
                            <Text
                              size="sm"
                              fw={500}
                              c={isMe ? "white" : "light-dark(black, white)"}
                              style={{ wordBreak: "break-word" }}
                            >
                              {msg.content}
                            </Text>
                          </Box>

                          {!isMe && (
                            <Text
                              size="11px"
                              fw={500}
                              c="light-dark(gray.6, gray.5)"
                              mb={4}
                              style={{ flexShrink: 0 }}
                            >
                              {new Date(msg.createdAt).toLocaleTimeString([], {
                                hour: "2-digit",
                                minute: "2-digit",
                              })}
                            </Text>
                          )}
                        </Group>
                      );
                    })
                  )}
                </Stack>
              </ScrollArea>

              <Box
                p={{ base: "sm", md: "md" }}
                px={{ base: "md", md: "xl" }}
                style={{
                  flexShrink: 0,
                  backgroundColor:
                    "light-dark(var(--mantine-color-white), var(--mantine-color-dark-7))",
                  borderTop:
                    "1px solid light-dark(var(--mantine-color-gray-2), var(--mantine-color-dark-4))",
                  zIndex: 100,
                  position: "sticky",
                  bottom: 0,
                  width: "100%",
                }}
              >
                <Group gap="xs" wrap="nowrap">
                  <ActionIcon variant="subtle" color="gray" size="lg">
                    <IconPaperclip size={20} />
                  </ActionIcon>
                  <TextInput
                    placeholder="Type a message..."
                    style={{ flex: 1 }}
                    radius="xl"
                    size="md"
                    value={inputValue}
                    onChange={(e) => setInputValue(e.currentTarget.value)}
                    onKeyDown={(e) => e.key === "Enter" && handleSendMessage()}
                  />
                  <ActionIcon
                    variant="filled"
                    color="violet"
                    size="lg"
                    radius="xl"
                    loading={isSending}
                    onClick={handleSendMessage}
                  >
                    <IconSend size={18} />
                  </ActionIcon>
                </Group>
              </Box>
            </>
          )}
        </Box>
      )}

      <Modal
        opened={opened}
        onClose={close}
        title={<Text fw={700}>New Conversation</Text>}
        centered
        radius="lg"
      >
        <Stack>
          <Checkbox
            label="Group Chat"
            checked={isGroup}
            onChange={(e) => setIsGroup(e.currentTarget.checked)}
          />
          {isGroup && (
            <TextInput
              label="Group Name"
              placeholder="Team Alpha"
              required
              value={groupName}
              onChange={(e) => setGroupName(e.target.value)}
            />
          )}
          <MultiSelect
            label={isGroup ? "Select Members" : "Select User"}
            placeholder="Search by name..."
            data={globalUsers}
            searchable
            onSearchChange={handleGlobalSearch}
            value={selectedUsers}
            onChange={setSelectedUsers}
            maxValues={isGroup ? undefined : 1}
            leftSection={
              isGroup ? <IconUsers size={16} /> : <IconUserPlus size={16} />
            }
          />
          <Button
            fullWidth
            color="violet"
            radius="xl"
            disabled={selectedUsers.length === 0 || (isGroup && !groupName)}
            onClick={handleCreateChat}
          >
            Start {isGroup ? "Group" : "Chat"}
          </Button>
        </Stack>
      </Modal>
    </Box>
  );
}
