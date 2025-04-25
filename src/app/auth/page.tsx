'use client';

import React, { useState } from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { auth, db } from '@/lib/firebase';
import {
    createUserWithEmailAndPassword,
    signInWithEmailAndPassword,
    sendPasswordResetEmail,
    sendEmailVerification,
} from 'firebase/auth';
import Link from 'next/link';
import { doc, setDoc } from 'firebase/firestore';
import { useRouter } from 'next/navigation';
import { Eye, EyeOff, Home } from 'lucide-react';

export default function AuthPage() {
    const [isLogin, setIsLogin] = useState(true);
    const [forgotPassword, setForgotPassword] = useState(false);
    const [showPassword, setShowPassword] = useState(false);
    const [loading, setLoading] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const router = useRouter();

    const [formData, setFormData] = useState({
        name: '',
        email: '',
        password: '',
        role: '',
        companyName: '',
        productName: '',
    });

    const [resetEmail, setResetEmail] = useState('');

    const validateEmailDomain = (email: string): boolean => {
        const domainPattern = /^[^\s@]+@([^\s@]+\.[^\s@]+)$/;
        const validDomains = ['gmail.com', 'yahoo.com', 'outlook.com', 'hotmail.com', 'protonmail.com'];
        const match = email.match(domainPattern);
        return !!match && validDomains.includes(match[1]);
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (isSubmitting) return;
        setIsSubmitting(true);
        setLoading(true);

        try {
            if (!validateEmailDomain(formData.email)) {
                alert('❌ Invalid or unsupported email domain!');
                return;
            }

            if (isLogin) {
                const userCredential = await signInWithEmailAndPassword(auth, formData.email, formData.password);
                const user = userCredential.user;

                if (user && !user.emailVerified) {
                    alert('⚠️ Your email is not verified. Please check your inbox for the verification link.');
                } else {
                    alert('✅ Logged in!');
                    router.push('/dashboard');
                }
            } else {
                const userCredential = await createUserWithEmailAndPassword(auth, formData.email, formData.password);
                const user = userCredential.user;

                await setDoc(doc(db, 'users', user.uid), {
                    name: formData.name,
                    email: formData.email,
                    role: formData.role,
                    companyName: formData.companyName,
                    productName: formData.productName,
                    createdAt: new Date(),
                });

                try {
                    await sendEmailVerification(user);
                    alert('✅ Account created! Please check your email to verify your account.');
                } catch (error: any) {
                    console.error('Error sending verification email:', error);
                    alert(`❌ Failed to send verification email: ${error.message}`);
                }
            }
        } catch (error: any) {
            console.error("Registration/Login Error:", error);
            console.error("Error Code:", error.code);
            console.error("Error Message:", error.message);
            alert(`❌ ${error.message}`);
        } finally {
            setLoading(false);
            setIsSubmitting(false);
        }
    };

    const handlePasswordReset = async () => {
        if (!resetEmail) return alert('Enter your registered email');

        try {
            await sendPasswordResetEmail(auth, resetEmail);
            alert('📧 Password reset link sent!');
        } catch (error: any) {
            alert(`❌ ${error.message}`);
        }
    };

    const handleToggle = () => {
        setIsLogin((prev) => !prev);
        setFormData({ name: '', email: '', password: '', role: '', companyName: '', productName: '' });
        setForgotPassword(false);
    };

    return (
        <div className="max-w-md mx-auto my-10 p-6 rounded-xl bg-white shadow-md relative">
            <Link href="/" className="absolute top-4 left-4">
                <Button variant="ghost" size="icon">
                    <Home className="h-5 w-5" />
                </Button>
            </Link>
            <h2 className="text-2xl font-semibold text-center mb-4">
                {forgotPassword ? '🔑 Forgot Password' : isLogin ? '🔐 Login' : '📝 Register'}
            </h2>

            {forgotPassword ? (
                <>
                    <Input
                        type="email"
                        placeholder="Enter your registered email"
                        value={resetEmail}
                        onChange={(e) => setResetEmail(e.target.value)}
                        className="mb-4"
                    />
                    <Button onClick={handlePasswordReset}>Send Reset Link</Button>
                    <Button variant="ghost" onClick={() => setForgotPassword(false)}>
                        Back
                    </Button>
                </>
            ) : (
                <form onSubmit={handleSubmit}>
                    {!isLogin && (
                        <>
                            <Input
                                type="text"
                                name="name"
                                placeholder="Full Name"
                                value={formData.name}
                                onChange={handleChange}
                                className="mb-3"
                            />
                            <Input
                                type="text"
                                name="role"
                                placeholder="Your Role (e.g. Student, Supervisor)"
                                value={formData.role}
                                onChange={handleChange}
                                className="mb-3"
                            />
                            <Input
                                type="text"
                                name="companyName"
                                placeholder="Company Name"
                                value={formData.companyName}
                                onChange={handleChange}
                                className="mb-3"
                            />
                            <Input
                                type="text"
                                name="productName"
                                placeholder="Product Name (e.g., Steel, Plastic)"
                                value={formData.productName}
                                onChange={handleChange}
                                className="mb-3"
                            />
                        </>
                    )}

                    <Input
                        type="email"
                        name="email"
                        placeholder="Email"
                        value={formData.email}
                        onChange={handleChange}
                        className="mb-3"
                    />
                    <div className="relative mb-3">
                        <Input
                            type={showPassword ? 'text' : 'password'}
                            name="password"
                            placeholder="Password"
                            value={formData.password}
                            onChange={handleChange}
                        />
                        <div
                            className="absolute right-3 top-2 cursor-pointer"
                            onClick={() => setShowPassword((prev) => !prev)}
                        >
                            {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                        </div>
                    </div>
                    <Button type="submit" className="w-full mt-2" disabled={loading || isSubmitting}>
                        {isLogin ? 'Login' : 'Register'}
                    </Button>

                    <div className="mt-4 text-center space-y-2">
                        <Button variant="ghost" type="button" onClick={handleToggle}>
                            {isLogin ? "Don't have an account? Register" : 'Already have an account? Login'}
                        </Button>
                        <Button variant="link" type="button" onClick={() => setForgotPassword(true)}>
                            Forgot Password?
                        </Button>
                    </div>
                </form>
            )}
        </div>
    );
}