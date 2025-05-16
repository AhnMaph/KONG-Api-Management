import { useState, useEffect, useRef } from "react";
import { Link } from "react-router-dom";
import bglogin from "@/assets/backlogin.png";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {faInfoCircle } from "@fortawesome/free-solid-svg-icons";
import { registerUser } from "../../actions/userActions";
import LogoWeb from "@/assets/logo.png";
import { login } from "../../types/user/userSlice";
import { useDispatch } from "react-redux";
import { AppDispatch } from "../../store";

const USER_REGEX = /^[a-zA-Z][a-zA-Z0-9-_]{3,23}$/;
const PWD_REGEX = /^(?=.*[a-z])(?=.*[A-Z])(?=.*[!@#$]).{8,24}$/;
const EMAIL_REGEX = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
export default function RegisterScreen() {
    const userRef = useRef<HTMLInputElement | null>(null);
    const errRef = useRef<HTMLInputElement | null>(null);
    const [user, setUser] = useState('');
    const [validName, setValidName] = useState(false);
    const [userFocus, setUserFocus] = useState(false);

    const [pwd, setPwd] = useState('');
    const [validPwd, setValidPwd] = useState(false);
    const [pwdFocus, setPwdFocus] = useState(false);

    const [matchPwd, setMatchPwd] = useState('');
    const [validMatch, setValidMatch] = useState(false);
    const [matchFocus, setMatchFocus] = useState(false);

    const [email, setEmail] = useState('');
    const [validEmail, setValidEmail] = useState(false);
    const [emailFocus, setEmailFocus] = useState(false);


    const [errMsg, setErrMsg] = useState('');
    const [success, setSuccess] = useState(false);

    const dispatch = useDispatch<AppDispatch>();
    useEffect(() => {
        userRef.current?.focus();
    }, []);

    useEffect(() => {
        const result = USER_REGEX.test(user);
        setValidName(result);
        console.log("User:", user, "Valid Name:", result);
    }, [user]);

    useEffect(() => {
        const result = EMAIL_REGEX.test(email);
        setValidEmail(result);
        console.log("Email:", email, "Valid Email:", result);
    }, [email]);


    useEffect(() => {
        const result = PWD_REGEX.test(pwd);
        setValidPwd(result);
        console.log(result);
        const match = pwd === matchPwd;
        setValidMatch(match);
        console.log(match);
    }, [pwd, matchPwd]);

    useEffect(() => {
        setErrMsg('');
    }, [user, pwd, matchPwd]);

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        const v1 = USER_REGEX.test(user);
        const v2 = PWD_REGEX.test(pwd);
        if (!v1 || !v2) {
            setErrMsg("Invalid Entry");
            return;
        }
        try { 
            const response = await registerUser(user, email, pwd);
            console.log(response.status)
            if(response?.status!==200) throw new Error("Registration failed");
            setSuccess(true);
            dispatch(login({
                        _id:response.data.id,
                        email:email,
                        username:user,
                        isLogin:true,}))
            setUser('');
            setPwd('');
        } catch (err: any) {
            console.log(err)
            setSuccess(false);
            if (!err?.response) {
                setErrMsg('No Server Response');
            } else if (err.response?.status === 409) {
                setErrMsg('Username Taken');
            } 
            else if (err.response?.status === 400) {
                setErrMsg('Email Taken');
            } 
            else {
                setErrMsg('Registration Failed');
            }
            if (errRef.current) {
                errRef.current.focus();
            }
        }
    };

    return (
        <div className="bg-black text-white font-Nurito flex flex-col md:flex-row items-center justify-center min-h-screen px-4">
            {success ? (
                <section>
                    <h1>Success!</h1>
                    <p>
                        <Link to="/auth/login">Sign In</Link>
                    </p>
                </section>
            ) : (
                <>
                    {/* Left Column (Image) */}
                    <div className="hidden md:flex w-1/2 h-auto items-center justify-center">
                        <img src={bglogin} alt="loginbackground" className="max-w-full h-auto" />
                    </div>

                    {/* Right Column (Form) */}
                    <div className="w-80 md:w-1/2 p-6 md:p-8 rounded-lg shadow-lg md:mr-10">
                    <div className="flex justify-center mb-4">

                            <Link to="/"><img src={LogoWeb} alt="loginbackground" className="max-w-full h-auto" /></Link>
                        </div>
                        
                        <div className="bg-gray-800 w-5/5 mr-10 border-t-orange-500 border-t-5">
                            <div className="h-4"></div>
                            <form className="bg-gray-800 ml-10 mr-10" onSubmit={handleSubmit}>
                                <h1 className="text-2xl font-bold mb-4 flex items-center justify-center">Đăng ký</h1>
                                <p ref={errRef} className={errMsg ? "errmsg" : "offscreen"} aria-live="assertive">{errMsg}</p>

                                <div className="mb-4 w-full">
                                    <label htmlFor="username" className="font-medium whitespace-nowrap">User Name</label>
                                    <input
                                        type="text"
                                        id="username"
                                        ref={userRef}
                                        autoComplete="off"
                                        onChange={(e) => setUser(e.target.value)}
                                        value={user}
                                        required
                                        aria-invalid={validName ? "false" : "true"}
                                        aria-describedby="uidnote"
                                        onFocus={() => setUserFocus(true)}
                                        onBlur={() => setUserFocus(false)}
                                        className="p-2 border rounded w-full"
                                        placeholder="Nhập user name"
                                    />
                                    <p id="uidnote" className={userFocus && !validName ? "instructions" : "offscreen"}>
                                        <FontAwesomeIcon icon={faInfoCircle} />
                                         4 to 24 characters.<br />
                                        Must begin with a letter.<br />
                                        Letters, numbers, underscores, hyphens allowed.
                                    </p>

                                </div>

                                <div className="mb-4 w-full">
                                    <label htmlFor="email" className="font-medium whitespace-nowrap">Email</label>
                                    <input
                                        type="email"
                                        id="email"
                                        ref={userRef}
                                        onChange={(e) => setEmail(e.target.value)}
                                        value={email}
                                        required
                                        aria-invalid={validEmail ? "false" : "true"}
                                        aria-describedby="uidnote"
                                        onFocus={() => setEmailFocus(true)}
                                        onBlur={() => setEmailFocus(false)}
                                        className="p-2 border rounded w-full"
                                        placeholder="Nhập Email"
                                    />
                                    <p id="uidnote" className={emailFocus && !validEmail ? "instructions" : "offscreen"}>
                                        <FontAwesomeIcon icon={faInfoCircle} />
                                         Please enter an valid email.<br />
                                    </p>

                                </div>

                                <div className="mb-4 w-full">
                                    <label htmlFor="password" className="block font-medium w-full">Password</label>
                                    <input
                                        type="password"
                                        id="password"
                                        onChange={(e) => setPwd(e.target.value)}
                                        value={pwd}
                                        required
                                        aria-invalid={validPwd ? "false" : "true"}
                                        aria-describedby="pwdnote"
                                        onFocus={() => setPwdFocus(true)}
                                        onBlur={() => setPwdFocus(false)}
                                        className="p-2 border rounded w-full"
                                        placeholder="Nhập mật khẩu"
                                    />
                                    <p id="pwdnote" className={pwdFocus && !validPwd ? "instructions" : "offscreen"}>
                                        <FontAwesomeIcon icon={faInfoCircle} />
                                         8 to 24 characters.<br />
                                        Must include uppercase and lowercase letters, a number and a special character.<br />
                                        Allowed special characters: ! @ # $ %
                                    </p>
                                </div>
                                <div className="mb-4 w-full">
                                    <label htmlFor="confirm_pwd" className="block font-medium w-full">Confirm Password</label>
                                    <input
                                        type="password"
                                        id="confirm_pwd"
                                        onChange={(e) => setMatchPwd(e.target.value)}
                                        value={matchPwd}
                                        required
                                        aria-invalid={validMatch ? "false" : "true"}
                                        aria-describedby="confirmnote"
                                        onFocus={() => setMatchFocus(true)}
                                        onBlur={() => setMatchFocus(false)}
                                        className="p-2 border rounded w-full"
                                        placeholder="Nhập lại mật khẩu"
                                    />
                                    <p id="confirmnote" className={matchFocus && !validMatch ? "instructions" : "offscreen"}>
                                        <FontAwesomeIcon icon={faInfoCircle} />
                                         Must match the first password input field.
                                    </p>
                                </div>

                                <div className="flex flex-col sm:flex-row justify-between space-y-2 sm:space-y-0">
                                    <div className="flex items-center">
                                        <input type="checkbox" id="remember" className="w-5 h-5 bg-gray-600" />
                                        <label htmlFor="remember" className="ml-2">Remember Account</label>
                                    </div>
                                </div>

                                <div className="h-4"></div>
                                <button
                                    type="submit"
                                    className="w-full bg-orange-500 text-white p-2 rounded hover:bg-yellow-400"
                                    disabled={!validName || !validPwd || !validMatch}
                                >
                                    Đăng ký
                                </button>

                                <div className="h-4"></div>
                                <div className="flex flex-row justify-center items-center mt-6 space-x-2 whitespace-nowrap pb-4">
                                    <h2>Old user?</h2>
                                    <Link to="/auth/login" className="text-orange-500 hover:text-yellow-400">Login</Link>
                                </div>
                            </form>
                        </div>
                    </div>
                </>
            )}
        </div>
    );
}