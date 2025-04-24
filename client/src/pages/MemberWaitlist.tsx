import { useEffect, useState } from "react";
import io from "socket.io-client";
import { User } from "../types/User";
import { IoClose } from "react-icons/io5";
import { FaCheckCircle } from "react-icons/fa";
import { TbCancel } from "react-icons/tb";

const socket = io(import.meta.env.VITE_SOCKET_URL, {
  reconnection: true,
  reconnectionAttempts: Infinity,
  reconnectionDelay: 1000,
  reconnectionDelayMax: 5000,
}); // Change to your backend URL

// Mock data to simulate a member
const mockMember: User = {
    _id: "1",
    firstName: "Richie",
    lastName: "Thiesfeldt",
    email: "john.doe@example.com",
    password: "", // Should not be exposed
    membership: "Gold", // Ensure this matches one of the valid membership types
    preferredBarber: "Charles Armon",
    drinkOfChoice: "Whiskey",
    isOfLegalDrinkingAge: true,
    appointments: ["appointment1", "appointment2"],
    phoneNumber: "555-1234",
    photoId: null, // Assuming no photoId for this mock user
    verifiedId: true,
    isAdmin: false,
    createdAt: "2025-02-23T12:00:00Z",
    updatedAt: "2025-02-23T12:00:00Z",
    dob: "1990-01-01",
    wantsDrink: true,
    checkInTime: "2025-02-24T20:28:48.570Z",
    paymentStatus: "past_due",
  };

const MemberWaitlist = () => {
  const [members, setMembers] = useState<User[]>([]);

  // Load members from localStorage on mount
  useEffect(() => {
    // Try to load waitlist from localStorage
    const storedMembers = localStorage.getItem("members");
    if (storedMembers) {
      setMembers(JSON.parse(storedMembers)); // Parse and set from localStorage
    } else {
      setMembers([mockMember]); // Set mock data if none in localStorage (just for testing)
    }

    // Listen for new check-ins
    socket.on("memberCheckedIn", (newMember: User) => {
      setMembers((prev) => {
        const updatedMembers = [...prev, newMember];
        localStorage.setItem("members", JSON.stringify(updatedMembers)); // Save to localStorage
        return updatedMembers;
      });
    });

    // Listen for completed appointments
    socket.on("memberCompleted", (memberId: string) => {
      setMembers((prev) => {
        const updatedMembers = prev.filter((m) => m._id !== memberId);
        localStorage.setItem("members", JSON.stringify(updatedMembers)); // Save to localStorage
        return updatedMembers;
      });
    });

    console.log(members);

    return () => {
      socket.off("memberCheckedIn");
      socket.off("memberCompleted");
    };
  }, []);

  // Handle removing a member (this could be used for "checking out" a member)
  const handleRemoveMember = (memberId: string) => {
    setMembers((prev) => {
      const updatedMembers = prev.filter((m) => m._id !== memberId);
      localStorage.setItem("members", JSON.stringify(updatedMembers)); // Save to localStorage
      return updatedMembers;
    });
  };

  return (
    <div className="h-screen bg-black text-white flex flex-col items-center justify-start p-6">
      <h1 className="text-3xl font-bold mb-4">Member Waitlist</h1>
      <ul className="w-full">
        {members.map((member) => (
          <li key={member._id} className={`flex justify-between bg-gray-200 p-4 rounded-lg mb-2 ${member.paymentStatus === "past_due" && ("border-2 border-red-500")}`}>
            <div className="flex">
                <div className={`w-6 h-15 my-2 rounded-md ${getMembershipColor(member)}`}></div>
                <div className="flex flex-col items-start justify-between py-2">
                    <div className=" flex items-center px-2 text-lg text-black font-semibold pt-1">{member.firstName} {member.lastName} {member.paymentStatus === "active" && (<FaCheckCircle className="text-emerald-500 ml-1"/>)} </div> {/* <TbCancel className="text-red-500 ml-1"/> */}
                    <p className="text-md font-semibold text-gray-800 px-2 pb-2"> <strong className="font-semibold">{member.membership}</strong> Member</p>
                </div>
                {/* <p className="text-sm text-gray-400">Checked in at {member.checkInTime}</p> */}
                <div className="flex items-center space-x-12 ml-8">
                    <div className="flex flex-col items-center">
                        <p className="text-gray-500 border-b border-gray-500 px-4 pb-1">Barber</p>
                        <p className="text-gray-800 font-semibold my-3">{member.preferredBarber}</p>
                    </div>
                    <div className="flex flex-col items-center">
                        <p className="text-gray-500 border-b border-gray-500 px-4 pb-1">Drink</p>
                        <p className="text-gray-800 font-semibold my-3">{member.drinkOfChoice}</p>
                    </div>
                    <div className="flex flex-col items-center">
                        <p className="text-gray-500 border-b border-gray-500 px-4 pb-1">Haircut</p>
                        <p className="text-gray-800 font-semibold my-3">Fade</p>
                    </div>
                    <div className="flex flex-col items-center">
                        <p className="text-gray-500 border-b border-gray-500 px-4 pb-1">Duration</p>
                        <p className="text-gray-800 font-semibold my-3">45 min</p>
                    </div>
                    {member.verifiedId ? (
                      <div className="flex flex-col items-center">
                        <p className="text-gray-500 border-b border-gray-500 px-4 pb-1">ID</p>
                        <p className="text-sm bg-green-200 border border-green-500 px-2 py-1 rounded-md text-gray-800 font-semibold mb-2 mt-3">Verified</p>
                      </div>
                    ) : (
                      <div className="flex flex-col items-center">
                        <p className="text-gray-500 border-b border-gray-500 px-4 pb-1">ID</p>
                        <p className="text-sm bg-red-200 border border-red-500 px-2 py-1 rounded-md text-gray-800 font-semibold mb-2 mt-3">Not Verified</p>
                      </div>
                    )}
                    <div className="flex flex-col items-center">
                        <p className="text-gray-500 border-b border-gray-500 px-4 pb-1">Checked In</p>
                        <p className="text-gray-800 font-semibold my-3">
                          {member.checkInTime
                            ? new Date(member.checkInTime).toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit" })
                            : "Invalid"}
                        </p>
                    </div>
                    {member.paymentStatus === "past_due" && (
                      <p className="font-bold text-lg text-red-500 uppercase">Past Due Payment</p>
                    )}
                </div>
            </div>
            <div className="flex items-center">
                <IoClose onClick={() => handleRemoveMember(member._id)} className="text-gray-800 text-3xl cursor-pointer" />
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
};

const getMembershipColor = (member: User): string =>
  member.paymentStatus === 'past_due'
    ? 'bg-red-500'
    : member.membership === 'Gold'
    ? 'bg-orange-300'
    : member.membership === 'Silver'
    ? 'bg-gray-400'
    : member.membership === 'Bronze'
    ? 'bg-orange-800'
    : 'bg-black';

export default MemberWaitlist;
