import React from 'react';

const RegisterForm = ({ registerData, setRegisterData, onSubmit, switchToLogin }) => (
    <form onSubmit={onSubmit} className="w-full">
        <div className="flex justify-between items-center mb-4">
            <h1 className="text-4xl -mt-2.5 mb-0">Register</h1>
            <button type="button" onClick={switchToLogin} className="text-[#0046be] border-2 border-[#e5ebf1] px-4 py-3 rounded-2px hover:border-[#0046be] transition-colors duration-200">
                    Sign In
            </button>
        </div>
        <div className="grid grid-cols-2 gap-4 mt-6">
            <input
                type="text"
                placeholder="First Name"
                value={registerData.firstName}
                onChange={(e) => setRegisterData({ ...registerData, firstName: e.target.value })}
                className="py-3 px-5 pr-12 bg-[#ffffff] rounded-2px border-2 border-[#e5ebf1]"
            />
            <input
                type="text"
                placeholder="Last Name"
                value={registerData.lastName}
                onChange={(e) => setRegisterData({ ...registerData, lastName: e.target.value })}
                className="py-3 px-5 pr-12 bg-[#ffffff] rounded-2px border-2 border-[#e5ebf1]"
            />
        </div>
        <input
            type="text"
            placeholder="Username"
            required
            value={registerData.username}
            onChange={(e) => setRegisterData({ ...registerData, username: e.target.value })}
            className="w-full mt-5 mb-5 py-3 px-5 pr-12 bg-[#ffffff] rounded-2px border-2 border-[#e5ebf1]"
        />
        <input
            type="email"
            placeholder="Email"
            required
            value={registerData.email}
            onChange={(e) => setRegisterData({ ...registerData, email: e.target.value })}
            className="w-full mb-5 py-3 px-5 pr-12 bg-[#ffffff] rounded-2px border-2 border-[#e5ebf1]"
        />
        <input
            type="password"
            placeholder="Password"
            required
            value={registerData.password}
            onChange={(e) => setRegisterData({ ...registerData, password: e.target.value })}
            className="w-full mb-5 py-3 px-5 pr-12 bg-[#ffffff] rounded-2px border-2 border-[#e5ebf1]"
        />
        <button 
            type="submit" 
            className="w-full mt-7 h-12 bg-[#0057e7] hover:bg-[#004cc9] text-white rounded-lg transition-colors duration-200"
            >
            Register
        </button>
    </form>
);

export default RegisterForm;
