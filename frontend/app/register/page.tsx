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

const formSchema = z.object({
  username: z
    .string()
    .min(5, "Bug title must be at least 5 characters.")
    .max(32, "Bug title must be at most 32 characters."),
  email: z
    .string()
    .min(5, "Description must be at least 20 characters.")
    .max(100, "Description must be at most 100 characters."),
  password: z
    .string()
    .min(5, "Bug title must be at least 5 characters.")
    .max(32, "Bug title must be at most 32 characters."),
});

export default function Register() {
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      username: "",
      email: "",
      password: "",
    },
  });

  async function onSubmit(data: z.infer<typeof formSchema>) {
    const res = await fetch(
      `${process.env.NEXT_PUBLIC_BACKEND_URL}/createUserByUsernameAndEmail`,
      {
        method: "Post",
        body: JSON.stringify(data),
        headers: { "Content-Type": "application/json" },
      },
    );
    console.log(await res.json());
  }

  const [showPassword, setShowPassword] = useState(false);

  return (
    <div className="flex min-h-screen w-full items-center justify-center">
      <Card className="gap-3">
        <CardHeader>
          <CardTitle>Register for an Account</CardTitle>
        </CardHeader>
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
        <CardContent>
          <Button onClick={form.handleSubmit(onSubmit)}>Submit</Button>
        </CardContent>
      </Card>
    </div>
  );
}
