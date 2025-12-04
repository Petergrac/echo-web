import { SmartphoneChargingIcon } from "lucide-react";

const SignUpPage = () => {
  return (
    <div className="min-h-screen pt-30 pb-10">
      <h1 className="text-4xl font-extrabold text-center">
        Welcome to Echo App
      </h1>
      <h2 className="text-3xl font-bold text-center pt-5">Join now</h2>
      <div className="flex w-full justify-center">
        <p className="flex w-1/2 gap-2 justify-center items-center font-bold pt-5">
          <span className="border grow flex"></span>Sign Up
          <span className="border flex grow"></span>
        </p>
      </div>
      <div className="flex flex-col gap-4 items-center mt-10 rounded-full">
        <input
          type="text"
          placeholder="Username"
          className="outline-1 p-4 rounded-full w-72"
        />
        <input
          type="email"
          placeholder="Email"
          className="outline-1 p-4 rounded-full w-72"
        />
        <div className="flex gap-2">
          <input
            type="text"
            placeholder="First Name"
            className="outline-1 p-2 rounded-full w-35"
          />
          <input
            type="text"
            placeholder="Last Name"
            className="outline-1 p-2 rounded-full w-35"
          />
        </div>
        <input
          type="password"
          placeholder="Password => 8 Characters long"
          className="outline-1 p-4 rounded-full w-72 mt-5"
        />
        <input
          type="password"
          placeholder="Confirm Password"
          className="outline-1 p-4 rounded-full w-72"
        />
        <button
          type="submit"
          className="bg-white font-bold text-black w-72 p-2 rounded-full mt-5"
        >
          Sign Up
        </button>
        <h1 className="mt-10 font-bold text-sky-500">
          Already have an account?
        </h1>
        <button
          type="submit"
          className="outline font-bold w-72 p-2 rounded-full mt-5"
        >
          Log In
        </button>
        <button
          type="submit"
          className="outline flex justify-center gap-2 font-bold w-72 p-2 rounded-full mt-5"
        >
          <SmartphoneChargingIcon />
          Get the app
        </button>
      </div>
    </div>
  );
};

export default SignUpPage;
