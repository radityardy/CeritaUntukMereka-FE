import React, { useEffect } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Button,
  Card,
  CardBody,
  CardHeader,
  Divider,
  Input,
  Textarea,
} from "@nextui-org/react";
import { Helmet } from "react-helmet";
import { Controller, useForm } from "react-hook-form";
import { Link, useNavigate } from "react-router-dom";
import { z } from "zod";
import { toast } from "react-toastify";
import axiosInstance from "../../lib/axiosInstance";
import LogoBlack from "../../assets/LogoBlack.png";

const orphanageFormSchema = z.object({
  username: z
    .string()
    .min(3)
    .max(20)
    .refine((val) => !/\s/.test(val), {
      message: "Username tidak boleh mengandung spasi",
    })
    .refine((val) => !/^[0-9]/.test(val), {
      message: "Username tidak boleh dimulai dengan angka",
    })
    .refine((val) => !/[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(val), {
      message: "Username tidak boleh mengandung karakter khusus",
    }),
  password: z
    .string()
    .min(8)
    .max(20)
    .refine((val) => /[A-Z]/.test(val), {
      message: "Password harus mengandung minimal 1 huruf besar",
    })
    .refine((val) => /[a-z]/.test(val), {
      message: "Password harus mengandung minimal 1 huruf kecil",
    })
    .refine((val) => /\d/.test(val), {
      message: "Password harus mengandung minimal 1 angka",
    })
    .refine((val) => /[@$!%*?&]/.test(val), {
      message:
        "Password harus mengandung minimal 1 karakter khusus seperti @$!%*?&",
    }),
  orphanages: z.object({
    name: z.string().min(3).max(50),
    address: z.string().max(100),
    phone_number: z.string().min(10).max(13),
    email: z.string().email(),
    description: z.string().max(200),
    web_url: z.string().url().or(z.literal("")).optional(),
  }),
});

const OrphanageSignUp = () => {
  const navigate = useNavigate();
  const { control, handleSubmit, watch, setError, clearErrors } = useForm({
    defaultValues: {
      username: "",
      password: "",
      orphanages: {
        name: "",
        address: "",
        phone_number: "",
        email: "",
        description: "",
        web_url: "",
      },
    },
    resolver: zodResolver(orphanageFormSchema),
  });

  const password = watch("password");
  const username = watch("username");
  const email = watch("orphanages.email");
  const phone_number = watch("orphanages.phone_number");
  const url = watch("orphanages.web_url");
  
  const validateField = (field, validations, setErrorCallback, clearErrorCallback) => {
    const errors = validations.reduce((acc, { test, message }) => {
      if (test) acc.push(message);
      return acc;
    }, []);
  
    if (errors.length > 0) {
      setErrorCallback(field, {
        type: "manual",
        message: errors.join(", "),
      });
    } else {
      clearErrorCallback(field);
    }
  };
  
  useEffect(() => {
    validateField(
      "username",
      [
        { test: /\s/.test(username), message: "Username tidak boleh mengandung spasi" },
        { test: username && username.length < 3, message: "Username harus memiliki minimal 3 karakter" },
        { test: username && username.length > 20, message: "Username tidak boleh lebih dari 20 karakter" },
        { test: /[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(username), message: "Username tidak boleh mengandung karakter khusus" },
        { test: /^[0-9]/.test(username), message: "Username tidak boleh dimulai dengan angka" },
      ],
      setError,
      clearErrors
    );
  }, [username, setError, clearErrors]);
  
  useEffect(() => {
    validateField(
      "orphanages.email",
      [{ test: email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email), message: "Email tidak valid" }],
      setError,
      clearErrors
    );
  }, [email, setError, clearErrors]);
  
  useEffect(() => {
    validateField(
      "orphanages.web_url",
      [
        { test: url && !/\./.test(url), message: "URL harus mengandung .com, .id, atau . lainnya" },
        { test: /\s/.test(url), message: "URL tidak boleh mengandung spasi" },
      ],
      setError,
      clearErrors
    );
  }, [url, setError, clearErrors]);
  
  useEffect(() => {
    validateField(
      "orphanages.phone_number",
      [{ test: phone_number && !/^0[0-9]{9,12}$/.test(phone_number), message: "Nomor telepon harus diawali dengan 0 dan memiliki 10-13 digit" }],
      setError,
      clearErrors
    );
  }, [phone_number, setError, clearErrors]);
  
  useEffect(() => {
    validateField(
      "password",
      [
        { test: password && !/[A-Z]/.test(password), message: "Password harus mengandung minimal 1 huruf besar" },
        { test: password && !/[a-z]/.test(password), message: "Password harus mengandung minimal 1 huruf kecil" },
        { test: password && !/\d/.test(password), message: "Password harus mengandung minimal 1 angka" },
        { test: password && !/[@$!%*?&]/.test(password), message: "Password harus mengandung minimal 1 karakter khusus seperti @$!%*?&" },
      ],
      setError,
      clearErrors
    );
  }, [password, setError, clearErrors]);
  

  const onSubmit = async (data) => {
    console.log("Form submitted", data); // Logging submission data
    try {
      const response = await axiosInstance.post('/auth/register/orphanages', data);
      console.log(response);
      
      if ([200, 201].includes(response.status)) {
        toast.success("Pendaftaran berhasil");
        navigate("/login");
      }
    } catch (error) {
      handleRegistrationError(error);
    }
  };
  
  const handleRegistrationError = (error) => {
    if (!error.response) {
      toast.error("Tidak dapat terhubung ke server. Periksa koneksi Anda.");
      return;
    }
  
    const { data } = error.response;
    if (data.errors) {
      Object.entries(data.errors).forEach(([field, messages]) => {
        setError(field, { type: "manual", message: messages.join(", ") });
      });
    } else {
      handleSpecificError(data.message || error.response.statusText);
    }
  };
  
  const handleSpecificError = (message) => {
    if (message.includes("email sudah digunakan")) {
      setError("email", { type: "manual", message: "Email ini sudah terdaftar" });
    } else if (message.includes("username sudah digunakan")) {
      setError("username", { type: "manual", message: "Username ini sudah digunakan" });
    } else {
      toast.error(`Kesalahan: ${message}`);
    }
  };
  
  const renderInput = (name, label, type = "text", options = {}) => (
    <Controller
      name={name}
      control={control}
      render={({ field, fieldState: { error } }) => (
        <>
          <Input
            {...field}
            label={label}
            type={type}
            className="mb-4"
            style={{ border: "none", outline: "none" }}
            {...options}
          />
          {error && <span className="text-red-500 text-sm">{error.message}</span>}
        </>
      )}
    />
  );
  
  const renderTextarea = (name, label) => (
    <Controller
      name={name}
      control={control}
      render={({ field, fieldState: { error } }) => (
        <>
          <Textarea
            {...field}
            label={label}
            className="mb-4"
            style={{ border: "none", outline: "none" }}
          />
          {error && <span className="text-red-500 text-sm">{error.message}</span>}
        </>
      )}
    />
  );
  

  return (
<div className="min-h-screen flex items-center justify-center bg-[#E0F7FA]">
  <Helmet>
    <title>Orphanage Register</title>
  </Helmet>
  <div className="bg-white shadow-lg rounded-lg flex flex-col md:flex-row max-w-5xl w-full overflow-hidden">
    {/* Left Side with Logo and Text */}
    <Link to="/" className="absolute top-5 left-5">
      <img
        src="https://img.icons8.com/?size=100&id=jqVLTIkbz7hy&format=png&color=228BE6"
        alt="Kembali"
        className="w-10 h-10"
      />
    </Link>
    <div className="hidden md:flex w-full md:w-1/3 bg-gradient-to-r from-blue-500 to-blue-400 items-center justify-center p-12">
      <div className="text-white text-center">
        <h2 className="text-5xl font-bold">CeritaUntuk Mereka</h2>
      </div>
    </div>

    {/* Right Side with Form */}
    <div className="w-full md:w-2/3 p-8 relative">
      <h1 className="text-4xl font-bold mb-4 text-gray-800">Orphanage Register</h1>
      <p className="text-gray-600 mb-8">
        Create an account and start receiving book donations to support your orphanage.
      </p>
      <form className="space-y-6" onSubmit={handleSubmit(onSubmit)}>
        <div className="space-y-6">
          {renderInput("orphanages.name", "Nama Panti Asuhan")}
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {renderInput("username", "Username")}
            {renderInput("password", "Password", "password")}
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {renderInput("orphanages.email", "Email", "email")}
            {renderInput("orphanages.phone_number", "Nomor Telepon", "tel", {
              inputMode: "numeric",
              pattern: "[0-9]*",
              onInput: (e) => {
                e.target.value = e.target.value.replace(/[^0-9]/g, "");
              },
            })}
          </div>
          {renderTextarea("orphanages.address", "Alamat")}
          {renderTextarea("orphanages.description", "Deskripsi")}
          {renderInput(
            "orphanages.web_url",
            "URL Website (Kosongi jika tidak ada)",
            "url"
          )}
        </div>

        <div className="flex items-center justify-between mt-6">
          <Button
            type="submit"
            color="blue"
            className="px-6 py-2 border border-blue-500 rounded-md bg-blue-500 text-white hover:bg-blue-600 transition duration-300"
          >
            Submit
          </Button>
          <Link
            to="/login"
            className="text-blue-600 hover:text-blue-800 transition duration-300"
          >
            Login
          </Link>
        </div>
      </form>
    </div>
  </div>
</div>

  
  

  );
};

export default OrphanageSignUp;