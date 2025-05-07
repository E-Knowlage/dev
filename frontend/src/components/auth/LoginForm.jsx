import React from 'react';

const LoginForm = ({ loginData, setLoginData, onSubmit, switchToRegister }) => (
    <form onSubmit={onSubmit} className="w-full">
        <div className="flex justify-between items-center mb-4">
            <h1 className="text-4xl -mt-2.5 mb-0">Login</h1>
            <button type="button" onClick={switchToRegister} className="text-[#0046be] border-2 border-[#e5ebf1] px-4 py-3 rounded-2px hover:border-[#0046be] transition-colors duration-200">
                    Register
            </button>
        </div>
        <div className="relative my-7">
            <input
                type="email"
                placeholder="Email"
                required
                value={loginData.email}
                onChange={(e) => setLoginData({ ...loginData, email: e.target.value })}
                className="w-full py-3 px-5 pr-12 bg-[#ffffff] rounded-2px border-2 border-[#e5ebf1]"
            />
        </div>
        <div className="relative my-7">
            <input
                type="password"
                placeholder="Password"
                required
                value={loginData.password}
                onChange={(e) => setLoginData({ ...loginData, password: e.target.value })}
                className="w-full py-3 px-5 pr-12 bg-[#ffffff] rounded-2px border-2 border-[#e5ebf1]"
            />
        </div>
        <button 
            type="submit" 
            className="w-full h-12 bg-[#0057e7] hover:bg-[#004cc9] text-white rounded-lg transition-colors duration-200"
            >
            Login
        </button>
    </form>
);

export default LoginForm;
