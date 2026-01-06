"use client";
import { SetStateAction, useState } from "react";

const ExploreTabs = ({
  setType,
}: {
  setType: React.Dispatch<SetStateAction<string>>;
}) => {
  const [activeTab, setActiveTab] = useState("for-you");
  const tabs = [
    {
      name: "For You",
      value: "for-you",
    },
    {
      name: "Following",
      value: "following",
    },
    {
      name: "Trending",
      value: "trending",
    },
    {
      name: "Discover",
      value: "discover",
    },
  ];
  return (
    <div className="flex w-full justify-around">
      {tabs.map((tab) => (
        <button
          onClick={() => {
            setType(tab.value);
            setActiveTab(tab.value);
          }}
          className={`${
            tab.value === activeTab &&
            "border-b-5 border-sky-500 bg-gray-800/20"
          } px-10 pt-5`}
          key={tab.value}
        >
          {tab.name}
        </button>
      ))}
    </div>
  );
};

export default ExploreTabs;
