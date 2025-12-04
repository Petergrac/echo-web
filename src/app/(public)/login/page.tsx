import { SmartphoneChargingIcon } from "lucide-react";

const LoginPage = () => {
  return (
    <div className="h-screen pt-30">
      <h1 className="text-4xl font-extrabold text-center">
        Welcome back to Echo App
      </h1>
      <h2 className="text-3xl font-bold text-center pt-5">Join now</h2>
      <div className="flex w-full justify-center">
        <p className="flex w-1/2 gap-2 justify-center items-center font-bold pt-5">
          <span className="border grow flex"></span>Login Here
          <span className="border flex grow"></span>
        </p>
      </div>
      <div className="flex flex-col items-center mt-10 mb-5 rounded-full">
        <input
          type="text"
          placeholder="Username or Email"
          className="outline-1 p-4 rounded-full w-72"
        />
        <input
          type="password"
          placeholder="Password"
          className="outline-1 p-4 rounded-full w-72 mt-5"
        />
        <button
          type="submit"
          className="bg-white font-bold text-black w-72 p-2 rounded-full mt-5"
        >
          Login
        </button>
        <h1 className="mt-10 font-bold text-sky-500">You don&apos;t have an account?</h1>
        <button
          type="submit"
          className="bg-white font-bold text-black w-72 p-2 rounded-full mt-5"
        >
          Sign Up here
        </button>
        <button
          type="submit"
          className="bg-white flex justify-center gap-2 font-bold text-black w-72 p-2 rounded-full mt-5"
        >
          <SmartphoneChargingIcon />
          Get the app
        </button>
      </div>
    </div>
  );
};

export default LoginPage;
