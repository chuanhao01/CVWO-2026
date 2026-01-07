"use client";

import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Field, FieldError, FieldLabel } from "@/components/ui/field";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { zodResolver } from "@hookform/resolvers/zod";
import { Controller, useForm } from "react-hook-form";
import * as z from "zod";
import { useState } from "react";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { Dialog, DialogContent, DialogHeader } from "@/components/ui/dialog";
import { DialogDescription, DialogTitle } from "@radix-ui/react-dialog";
import { Spinner } from "@/components/ui/spinner";
import { login } from "./actions";
import { useRouter } from "next/navigation";

export const formSchema = z.object({
  username: z.string(),
  password: z.string(),
});

export default function Page() {
  const router = useRouter();

  const formId = "login-form";
  const [disabled, setDisabled] = useState(false);
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      username: "",
      password: "",
    },
    disabled,
  });
  const formSubmitHandler = form.handleSubmit(async (data) => {
    setDisabled(true);
    if (!(await login(data))) {
      setIsErrorDialogOpen(true);
    } else {
      router.push("/home");
    }
    setDisabled(false);
  });

  const [showPassword, setShowPassword] = useState(false);
  const [isErrorDialogOpen, setIsErrorDialogOpen] = useState(false);

  return (
    <div className="flex min-h-screen w-full items-center justify-center">
      <Dialog open={isErrorDialogOpen} onOpenChange={setIsErrorDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle className="text-xl font-bold">
              Login Failed
            </DialogTitle>
            <DialogDescription>Please Try Again</DialogDescription>
          </DialogHeader>
        </DialogContent>
      </Dialog>

      <Card className="gap-3">
        <CardHeader>
          <CardTitle>Login</CardTitle>
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
