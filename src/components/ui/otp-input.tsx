"use client";

import { useState, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Loader2, CheckCircle2, XCircle } from "lucide-react";

interface OTPInputProps {
  length?: number;
  phoneNumber: string;
  onVerify: (otp: string) => Promise<boolean>;
  onResend?: () => Promise<void>;
  error?: string;
}

export default function OTPInput({
  length = 6,
  phoneNumber,
  onVerify,
  onResend,
  error: externalError,
}: OTPInputProps) {
  const [otp, setOtp] = useState<string[]>(Array(length).fill(""));
  const [isVerifying, setIsVerifying] = useState(false);
  const [isResending, setIsResending] = useState(false);
  const [verificationStatus, setVerificationStatus] = useState<"idle" | "success" | "error">("idle");
  const [error, setError] = useState<string>("");
  const [timer, setTimer] = useState(60);
  const [canResend, setCanResend] = useState(false);
  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);

  // Timer countdown
  useEffect(() => {
    if (timer > 0) {
      const interval = setInterval(() => {
        setTimer((prev) => prev - 1);
      }, 1000);
      return () => clearInterval(interval);
    } else {
      setCanResend(true);
    }
  }, [timer]);

  const handleChange = (index: number, value: string) => {
    // Only allow digits
    if (value && !/^\d+$/.test(value)) return;

    const newOtp = [...otp];
    newOtp[index] = value.slice(-1); // Take only last character
    setOtp(newOtp);
    setError("");
    setVerificationStatus("idle");

    // Auto-focus next input
    if (value && index < length - 1) {
      inputRefs.current[index + 1]?.focus();
    }

    // Auto-verify when all digits are entered
    if (newOtp.every((digit) => digit !== "") && index === length - 1) {
      handleVerify(newOtp.join(""));
    }
  };

  const handleKeyDown = (index: number, e: React.KeyboardEvent<HTMLInputElement>) => {
    // Handle backspace
    if (e.key === "Backspace") {
      if (!otp[index] && index > 0) {
        inputRefs.current[index - 1]?.focus();
      }
    }
    // Handle paste
    else if (e.key === "v" && (e.ctrlKey || e.metaKey)) {
      e.preventDefault();
      navigator.clipboard.readText().then((text) => {
        const digits = text.replace(/\D/g, "").slice(0, length);
        const newOtp = [...otp];
        digits.split("").forEach((digit, i) => {
          if (i < length) newOtp[i] = digit;
        });
        setOtp(newOtp);
        if (digits.length === length) {
          handleVerify(digits);
        }
      });
    }
  };

  const handleVerify = async (otpValue: string) => {
    setIsVerifying(true);
    setError("");
    setVerificationStatus("idle");

    try {
      const isValid = await onVerify(otpValue);
      if (isValid) {
        setVerificationStatus("success");
      } else {
        setVerificationStatus("error");
        setError("Invalid OTP. Please try again.");
      }
    } catch (err) {
      setVerificationStatus("error");
      setError(err instanceof Error ? err.message : "Verification failed");
    } finally {
      setIsVerifying(false);
    }
  };

  const handleResend = async () => {
    if (!canResend || !onResend) return;

    setIsResending(true);
    setError("");
    setOtp(Array(length).fill(""));
    setVerificationStatus("idle");

    try {
      await onResend();
      setTimer(60);
      setCanResend(false);
      inputRefs.current[0]?.focus();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to resend OTP");
    } finally {
      setIsResending(false);
    }
  };

  return (
    <div className="space-y-4">
      <div>
        <Label className="block mb-2">Enter Verification Code</Label>
        <p className="text-sm text-muted-foreground mb-4">
          We sent a 6-digit code to <span className="font-semibold">{phoneNumber}</span>
        </p>

        <div className="flex gap-2 justify-center mb-4">
          {otp.map((digit, index) => (
            <input
              key={index}
              ref={(el) => {
                inputRefs.current[index] = el;
              }}
              type="text"
              inputMode="numeric"
              maxLength={1}
              value={digit}
              onChange={(e) => handleChange(index, e.target.value)}
              onKeyDown={(e) => handleKeyDown(index, e)}
              disabled={isVerifying || verificationStatus === "success"}
              className={`
                w-12 h-14 text-center text-2xl font-semibold rounded-lg border-2
                focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary
                transition-all duration-200
                ${digit ? "border-primary bg-primary/5" : "border-border"}
                ${verificationStatus === "error" ? "border-destructive" : ""}
                ${verificationStatus === "success" ? "border-green-500 bg-green-50" : ""}
                disabled:opacity-50 disabled:cursor-not-allowed
              `}
              aria-label={`Digit ${index + 1}`}
            />
          ))}
        </div>

        {/* Status Messages */}
        {isVerifying && (
          <div className="flex items-center justify-center gap-2 text-sm text-blue-600">
            <Loader2 className="h-4 w-4 animate-spin" />
            <span>Verifying...</span>
          </div>
        )}

        {verificationStatus === "success" && (
          <div className="flex items-center justify-center gap-2 text-sm text-green-600">
            <CheckCircle2 className="h-4 w-4" />
            <span>Verified successfully!</span>
          </div>
        )}

        {(error || externalError) && (
          <div className="flex items-center justify-center gap-2 text-sm text-destructive">
            <XCircle className="h-4 w-4" />
            <span>{error || externalError}</span>
          </div>
        )}
      </div>

      {/* Resend Button */}
      <div className="text-center">
        {!canResend ? (
          <p className="text-sm text-muted-foreground">
            Resend code in <span className="font-semibold">{timer}s</span>
          </p>
        ) : (
          <Button
            type="button"
            variant="link"
            onClick={handleResend}
            disabled={isResending}
            className="text-primary"
          >
            {isResending ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin mr-2" />
                Sending...
              </>
            ) : (
              "Resend Code"
            )}
          </Button>
        )}
      </div>

      {/* Help Text */}
      <div className="text-center">
        <p className="text-xs text-muted-foreground">
          Didn&apos;t receive the code? Check your spam folder or try resending.
        </p>
      </div>
    </div>
  );
}
