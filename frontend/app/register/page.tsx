"use client";

import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardAction,
  CardContent,
  CardFooter,
} from "@/components/ui/card";
import { Field, FieldError, FieldLabel } from "@/components/ui/field";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { zodResolver } from "@hookform/resolvers/zod";
import { Controller, useForm } from "react-hook-form";
import * as z from "zod";
import { useState } from "react";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { checkUsername, checkEmail, register } from "./actions";
import { Dialog, DialogContent, DialogHeader } from "@/components/ui/dialog";
import { DialogDescription, DialogTitle } from "@radix-ui/react-dialog";
import { Spinner } from "@/components/ui/spinner";

export const formSchema = z.object({
  username: z
    .string()
    .min(3, "Username must be at least 3 characters.")
    .max(50, "Username is too long")
    .refine(checkUsername, { error: "Username already taken" }),
  email: z
    .email()
    .min(10, "Email must be at least 10 characters.")
    .max(200, "Email is too long")
    .refine(checkEmail, { error: "Email already used" }),
  password: z
    .string()
    .min(5, "Password must be atleast 5 characters")
    .max(50, "Password is too long"),
});

export default function Register() {
  const formId = "register-form";
  const [disabled, setDisabled] = useState(false);
  const form = useForm<z.infer<typeof formSchema>>({
    mode: "onBlur",
    resolver: zodResolver(formSchema),
    defaultValues: {
      username: "",
      email: "",
      password: "",
    },
    disabled,
  });
  const formSubmitHandler = form.handleSubmit(async (data) => {
    setDisabled(true);
    // if register was unsuccessful
    if (!(await register(data))) {
      setIsRegisterErrorDialogOpen(true);
    }
    setDisabled(false);
  });

  const [showPassword, setShowPassword] = useState(false);
  const [isRegisterErrorDialogOpen, setIsRegisterErrorDialogOpen] =
    useState(false);

  return (
    <div className="flex min-h-screen w-full items-center justify-center">
      <Dialog
        open={isRegisterErrorDialogOpen}
        onOpenChange={setIsRegisterErrorDialogOpen}
      >
        <DialogContent>
          <DialogHeader>
            <DialogTitle>
              <DialogTitle className="text-xl font-bold">
                Account Registration Failed
              </DialogTitle>
            </DialogTitle>
            <DialogDescription>
              Something unexpected happened while trying to create your account,
              please try again.
            </DialogDescription>
          </DialogHeader>
        </DialogContent>
      </Dialog>

      <Card className="gap-3">
        <CardHeader>
          <CardTitle>Register for an Account</CardTitle>
        </CardHeader>
        <form id={formId} onSubmit={formSubmitHandler}>
          <CardContent>
            <Controller
              name="username"
              control={form.control}
              render={({ field, fieldState }) => (
                <Field data-invalid={fieldState.invalid}>
                  <FieldLabel htmlFor={field.name}>Username</FieldLabel>
                  <Input
                    {...field}
                    className="lg:min-w-md"
                    id={field.name}
                    aria-invalid={fieldState.invalid}
                    placeholder="Username"
                    autoComplete="off"
                  />
                  {fieldState.invalid && (
                    <FieldError errors={[fieldState.error]} />
                  )}
                </Field>
              )}
            />
          </CardContent>
          <CardContent>
            <Controller
              name="email"
              control={form.control}
              render={({ field, fieldState }) => (
                <Field data-invalid={fieldState.invalid}>
                  <FieldLabel htmlFor={field.name}>Email</FieldLabel>
                  <Input
                    {...field}
                    id={field.name}
                    aria-invalid={fieldState.invalid}
                    placeholder="Email"
                    autoComplete="off"
                  />
                  {fieldState.invalid && (
                    <FieldError errors={[fieldState.error]} />
                  )}
                </Field>
              )}
            />
          </CardContent>
          <CardContent>
            <Controller
              name="password"
              control={form.control}
              render={({ field, fieldState }) => (
                <Field data-invalid={fieldState.invalid}>
                  <FieldLabel htmlFor={field.name}>Password</FieldLabel>
                  <Input
                    {...field}
                    id={field.name}
                    type={showPassword ? "text" : "password"}
                    aria-invalid={fieldState.invalid}
                    placeholder="Password"
                    autoComplete="off"
                  />
                  {fieldState.invalid && (
                    <FieldError errors={[fieldState.error]} />
                  )}
                  <div className="flex items-center gap-3">
                    <Checkbox
                      checked={showPassword}
                      onCheckedChange={(prev) => {
                        setShowPassword(!!prev);
                      }}
                    />
                    <Label>Show Password</Label>
                  </div>
                </Field>
              )}
            />
          </CardContent>
        </form>
        <CardContent>
          <Button
            disabled={!form.formState.isReady || disabled}
            type="submit"
            form={formId}
          >
            {!disabled ? "Submit" : <Spinner />}
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
