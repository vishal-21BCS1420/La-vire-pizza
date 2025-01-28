// import { Button } from "@/components/ui/button";
// import { Input } from "@/components/ui/input";
// import { Loader2, LockKeyholeIcon } from "lucide-react";
// import { useState } from "react";
// import { Link } from "react-router-dom";

// const ResetPassword = () => {
//     const [newPassword, setNewPassword] = useState<string>("");
//     const loading =  false;

//   return (
//     <div className="flex items-center justify-center min-h-screen w-full">
//       <form className="flex flex-col gap-5 md:p-8 w-full max-w-md rounded-lg mx-4">
//         <div className="text-center">
//           <h1 className="font-extrabold text-2xl mb-2">Reset Password</h1>
//           <p className="text-sm text-gray-600">Enter your new password to reset old one</p>
//         </div>
//         <div className="relative w-full">
//             <Input
//             type="password"
//             value={newPassword}
//             onChange={(e) => setNewPassword(e.target.value)}
//             placeholder="Enter your new password"
//             className="pl-10"
//             />
//             <LockKeyholeIcon className="absolute inset-y-2 left-2 text-gray-600 pointer-events-none"/>
//         </div>
//         {
//             loading ? (
//                 <Button disabled className="bg-orange hover:bg-hoverOrange"><Loader2 className="mr-2 h-4 w-4 animate-spin"/> Please wait</Button>
//             ) : (
//                 <Button className="bg-orange hover:bg-hoverOrange">Reset Password</Button>
//             )
//         }
//         <span className="text-center">
//             Back to{" "}
//             <Link to="/login" className="text-blue-500">Login</Link>
//         </span>
//       </form>
//     </div>
//   );
// };

// export default ResetPassword;
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Loader2, LockKeyholeIcon } from "lucide-react";
import { useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { toast } from "sonner";
import axios from "axios";
import { API_END_POINT } from "@/store/useUserStore";

const ResetPassword = () => {
  const [newPassword, setNewPassword] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);
  const { token } = useParams<{ token: string }>();
  const navigate = useNavigate();

  const resetPassword = async (token: string, newPassword: string) => {
    try {
      setLoading(true);
      const response = await axios.post(
        `${API_END_POINT}/reset-password/${token}`,
        { newPassword }
      );
      if (response.data.success) {
        toast.success(response.data.message);
        navigate("/login");
      }
    } catch (error: any) {
      toast.error(
        error.response?.data?.message || "Something went wrong. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (token) {
      await resetPassword(token, newPassword);
    } else {
      toast.error("Reset token is missing!");
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen w-full">
      <form
        onSubmit={handleSubmit}
        className="flex flex-col gap-5 md:p-8 w-full max-w-md rounded-lg mx-4"
      >
        <div className="text-center">
          <h1 className="font-extrabold text-2xl mb-2">Reset Password</h1>
          <p className="text-sm text-gray-600">
            Enter your new password to reset the old one
          </p>
        </div>
        <div className="relative w-full">
          <Input
            type="password"
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
            placeholder="Enter your new password"
            className="pl-10"
            required
          />
          <LockKeyholeIcon className="absolute inset-y-2 left-2 text-gray-600 pointer-events-none" />
        </div>
        {loading ? (
          <Button disabled className="bg-orange hover:bg-hoverOrange">
            <Loader2 className="mr-2 h-4 w-4 animate-spin" /> Please wait
          </Button>
        ) : (
          <Button type="submit" className="bg-orange hover:bg-hoverOrange">
            Reset Password
          </Button>
        )}
        <span className="text-center">
          Back to{" "}
          <Link to="/login" className="text-blue-500">
            Login
          </Link>
        </span>
      </form>
    </div>
  );
};

export default ResetPassword;
