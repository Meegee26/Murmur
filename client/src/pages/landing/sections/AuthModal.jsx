import {
  Modal,
  TextInput,
  PasswordInput,
  Button,
  Group,
  Stack,
  Divider,
  Text,
  Anchor,
  Tabs,
  SimpleGrid,
  Box,
  PinInput,
  LoadingOverlay,
} from "@mantine/core";
import { GoogleLogin } from "@react-oauth/google";
import { useNavigate } from "react-router-dom";
import { useForm } from "@mantine/form";
import { useAuth } from "../../../hooks/useAuth.js";
import { useState } from "react";
import { api } from "../../../utils/api.js";

export function AuthModal({ opened, close }) {
  const navigate = useNavigate();
  const { addUserToAuthContext, signIn, signUp } = useAuth();
  const [activeTab, setActiveTab] = useState("login");
  const [step, setStep] = useState("details");
  const [tempData, setTempData] = useState(null);
  const [passwordVisible, setPasswordVisible] = useState(false);
  const [isGoogleAuthLoading, setIsGoogleAuthLoading] = useState(false);
  const [isManualAuthLoading, setIsManualAuthLoading] = useState(false);
  const isPending = isGoogleAuthLoading || isManualAuthLoading;

  const capitalize = (val) => {
    if (typeof val !== "string") return val;
    return val.charAt(0).toUpperCase() + val.slice(1).toLowerCase();
  };

  const form = useForm({
    initialValues: {
      email: "",
      password: "",
      firstName: "",
      lastName: "",
    },
    validate: {
      email: (val) => (/^\S+@\S+$/.test(val) ? null : "Invalid email"),
      password: (val) =>
        activeTab === "register" && val.length < 6
          ? "Password should include at least 6 characters"
          : null,
      firstName: (val) =>
        activeTab === "register" && val.length < 2
          ? "First name is required"
          : null,
      lastName: (val) =>
        activeTab === "register" && val.length < 2
          ? "Last name is required"
          : null,
    },
  });

  const handleGoogleSuccess = async (credentialResponse) => {
    try {
      setIsGoogleAuthLoading(true);
      const data = await api.googleSignIn(credentialResponse.credential);
      if (data.success) {
        addUserToAuthContext(data.data.user);
        close();
        navigate("/chat");
      }
    } catch (error) {
      console.error("Google Login Error:", error);
    } finally {
      setIsGoogleAuthLoading(false);
    }
  };

  const handleConfirmCredentials = async (values) => {
    const validation = form.validate();
    if (validation.hasErrors) return;

    try {
      setIsManualAuthLoading(true);
      if (activeTab === "login") {
        const response = await signIn({
          email: values.email,
          password: values.password,
        });

        if (response?.data?.user) {
          addUserToAuthContext(response.data.user);
        }

        close();
        navigate("/chat");
      } else {
        await api.requestOtp(values.email);
        setTempData(values);
        setStep("otp");
      }
    } catch (error) {
      const serverMessage = error.response?.data?.message;
      const status = error.response?.status;
      if (status === 409) {
        form.setFieldError("email", serverMessage || "Email already in use");
      } else if (status === 404) {
        form.setFieldError("email", serverMessage || "User not found");
      } else if (status === 401) {
        form.setFieldError("password", serverMessage || "Invalid password");
      } else {
        form.setFieldError(
          "password",
          "An unexpected error occurred. Please refresh the page and try again."
        );
      }
    } finally {
      setIsManualAuthLoading(false);
    }
  };

  const handleOtpVerify = async (otp) => {
    try {
      setIsManualAuthLoading(true);
      const response = await signUp({
        firstName: tempData.firstName,
        lastName: tempData.lastName,
        email: tempData.email,
        password: tempData.password,
        otp,
      });

      if (response?.data?.user) {
        addUserToAuthContext(response.data.user);
      }

      close();
      navigate("/chat");
    } catch (error) {
      const serverMessage = error.response?.data?.message;
      form.setFieldError("otp", serverMessage || "Invalid or expired code");
    } finally {
      setIsManualAuthLoading(false);
    }
  };

  return (
    <Modal
      opened={opened}
      onClose={isPending ? () => {} : close}
      closeOnClickOutside={false}
      centered
      radius="lg"
      size="md"
      padding="xl"
      overlayProps={{
        backgroundOpacity: 0.55,
        blur: 3,
      }}
      title={
        <Text fw={700} size="lg">
          Welcome to Murmur
        </Text>
      }
    >
      <Box pos="relative">
        <LoadingOverlay
          visible={isPending}
          zIndex={1000}
          overlayProps={{
            radius: "lg",
            blur: 2,
            color: "#252525",
            opacity: 0.6,
          }}
          loaderProps={{ size: "md", color: "violet", type: "bars" }}
        />

        {step === "otp" ? (
          <Stack align="center" py="md">
            <Text size="sm" ta="center">
              Enter the 6-digit code sent to <b>{tempData?.email}</b>
            </Text>
            <PinInput
              length={6}
              type="number"
              onComplete={handleOtpVerify}
              disabled={isPending}
              autoFocus
            />
            {form.errors.otp && (
              <Text c="red" size="xs" mt="xs">
                {form.errors.otp}
              </Text>
            )}
            <Button
              variant="subtle"
              size="xs"
              mt="md"
              onClick={() => setStep("details")}
              disabled={isPending}
            >
              Back to edit details
            </Button>
          </Stack>
        ) : (
          <>
            <Tabs
              value={activeTab}
              onChange={(val) => {
                if (!isPending) {
                  setActiveTab(val);
                  form.reset();
                  setPasswordVisible(false);
                }
              }}
              variant="pills"
              color="violet"
              radius="md"
              mb="md"
            >
              <Tabs.List grow>
                <Tabs.Tab value="login">Log In</Tabs.Tab>
                <Tabs.Tab value="register">Sign Up</Tabs.Tab>
              </Tabs.List>
            </Tabs>

            <Stack>
              <Group justify="center" grow>
                <GoogleLogin
                  onSuccess={handleGoogleSuccess}
                  text={activeTab === "login" ? "signin_with" : "signup_with"}
                  theme="filled_black"
                  shape="rectangular"
                  width="100%"
                />
              </Group>

              <Divider
                label="Or continue with email"
                labelPosition="center"
                my="sm"
              />

              <form onSubmit={form.onSubmit(handleConfirmCredentials)}>
                <Stack gap="md">
                  {activeTab === "register" && (
                    <SimpleGrid cols={2}>
                      <TextInput
                        required
                        label="First Name"
                        placeholder="Juan"
                        {...form.getInputProps("firstName")}
                        onBlur={(event) =>
                          form.setFieldValue(
                            "firstName",
                            capitalize(event.currentTarget.value)
                          )
                        }
                      />
                      <TextInput
                        required
                        label="Last Name"
                        placeholder="Dela Cruz"
                        {...form.getInputProps("lastName")}
                        onBlur={(event) =>
                          form.setFieldValue(
                            "lastName",
                            capitalize(event.currentTarget.value)
                          )
                        }
                      />
                    </SimpleGrid>
                  )}

                  <TextInput
                    required
                    label="Email"
                    placeholder="johndoe@gmail.com"
                    {...form.getInputProps("email")}
                  />

                  <PasswordInput
                    required
                    label="Password"
                    placeholder="Your secure password"
                    visible={passwordVisible}
                    onVisibilityChange={setPasswordVisible}
                    {...form.getInputProps("password")}
                  />

                  {activeTab === "login" && (
                    <Group justify="flex-end">
                      <Anchor size="xs" c="violet" href="#">
                        Forgot password?
                      </Anchor>
                    </Group>
                  )}

                  <Button
                    type="submit"
                    fullWidth
                    radius="md"
                    size="md"
                    color="violet.6"
                    mt="sm"
                  >
                    {activeTab === "login"
                      ? "Log In"
                      : "Send Verification Code"}
                  </Button>
                </Stack>
              </form>

              <Text c="dimmed" size="xs" ta="center" mt="md">
                Note: This is a{" "}
                <Text span fw={700} c="violet">
                  portfolio project
                </Text>
                .
              </Text>
            </Stack>
          </>
        )}
      </Box>
    </Modal>
  );
}
