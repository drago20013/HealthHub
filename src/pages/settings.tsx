import { useSession } from "next-auth/react";
import { useEffect, useState } from "react";
import CustomButton from '@/components/CustomButton';
import { Role } from '@prisma/client';
import { getUserInfo, updateUserInfo } from "@/lib/userInfo";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { TextField } from "@mui/material";
import { uploadImage } from "@/lib/cloudinary";

const UserSettings = () => {
    const { data: session, update } = useSession(); // it's not fired everytime, (only once), but I need to declare it to be able to access it

    const role = session?.user?.role;
    const [image, setImage] = useState('');

    const [firstName, setFirstName] = useState('');
    const [lastName, setLastName] = useState('');
    const [email, setEmail] = useState('');
    const [emailVerified, setEmailVerified] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [oldPassword, setOldPassword] = useState('');
    const [nationalId, setPesel] = useState('');
    const [insuranceId, setInsuranceId] = useState('');

    const updateUserNameAndSurname = async (e) => {
        e.preventDefault();
        const userData = {
            firstName,
            lastName
        }
        const res = updateUserInfo(userData)
        if ((await res).ok) {
            toast.success('Data updated successfully');
        }
        else {
            toast.error('Failed to update data');
        }
        console.log(userData)
        update(userData)
    }

    //TODO: After email change resend verification
    //also there may be implications with google OA accounts
    const updateUserEmail = async (e) => {
        e.preventDefault();
        const userData = {
            email,
        }
        const res = updateUserInfo(userData)

        if ((await res).ok) {
            toast.success('Email updated successfully');
        }
        else {
            toast.error('Failed to update email');
        }
    }

    const updateUserPassword = async (e) => {
        e.preventDefault();
        const userData = {
            newPassword,
            oldPassword
        }
        const res = updateUserInfo(userData)
        if ((await res).ok) {
            toast.success('Password updated successfully');
        }
        else {
            toast.error('Failed to update password');
        }
    }

    const updateUserPesel = async (e) => {
        e.preventDefault();
        const userData = {
            nationalId,
        }
        const res = updateUserInfo(userData)
        if ((await res).ok) {
            toast.success('Pesel updated successfully');
        }
        else {
            toast.error('Failed to update pesel');
        }
    }

    const updateUserInsurance = async (e) => {
        e.preventDefault();
        const userData = {
            insuranceId,
        }
        const res = updateUserInfo(userData)
        if ((await res).ok) {
            toast.success('Insurance data updated successfully');
        }
        else {
            toast.error('Failed to update insurance data');
        }
    }

    const fetchData = async () => {
        const response = await getUserInfo()
        const result = await response.json()
        setFirstName(result.data?.firstName)
        setLastName(result.data?.lastName)
        setEmail(result.data?.email)
        setInsuranceId(result.data?.patient?.insuranceId)
        setEmailVerified(result.data?.emailVerified)
        setPesel(result.data?.nationalId)
        setImage(result.data?.image)
    }

    useEffect(() => {
        fetchData()
    }, [session])

    const handlePictureChange = async (e) => {
        e.preventDefault();
        const file = e.target.files[0];
        if (file) {
            uploadImage(file)
                .then(async url => {
                    console.log(url);
                    setImage(url);
                    const userData = {
                        image: url,
                    };
                    const res = updateUserInfo(userData)

                    update(userData)
                    if ((await res).ok) {
                        toast.success('Profile picture updated successfully');
                    }

                })
                .catch(error => {
                    console.error('Error uploading file:', error);
                    toast.error('Failed to update profile picture');
                });
        }
    };

    return (
        <div>
            <div className="relative">
                <img src="https://picsum.photos/900" alt="Cover" className="w-full h-40 object-cover" />
                <div className="absolute inset-0 bg-gray-900 opacity-50"></div>
            </div>
            <div className="relative mx-auto -mt-16 w-32 h-32 rounded-full overflow-hidden border-4 border-white hover:cursor-pointer"
            >

                <label htmlFor="profileImageInput" className="w-full h-full">
                    <img
                        src={image ? image : "https://t3.ftcdn.net/jpg/00/64/67/80/360_F_64678017_zUpiZFjj04cnLri7oADnyMH0XBYyQghG.jpg"}
                        alt={session?.user?.name}
                        className="w-full h-full object-cover"
                    />
                    <input
                        id="profileImageInput"
                        type="file"
                        accept="image/*"
                        className="hidden"
                        onChange={handlePictureChange}
                    />
                </label>
            </div>
            <div className="mx-auto max-w-screen-lg my-8 px-4">
                <form onSubmit={updateUserNameAndSurname}>
                    <div className="my-6">
                        <TextField
                            fullWidth
                            required
                            label="Name"
                            value={firstName}
                            type={"text"}
                            onChange={(v) => setFirstName(v.target.value)}
                        />
                    </div>
                    <div className="mb-4">
                        <TextField
                            fullWidth
                            required
                            label="Surname"
                            value={lastName}
                            type={"text"}
                            onChange={(v) => setLastName(v.target.value)}
                        />
                    </div>

                    <CustomButton
                        buttonText={"Save Changes"}
                    />
                </form>
                <form onSubmit={updateUserEmail}>
                    <div className="my-10">
                        <TextField
                            fullWidth
                            required
                            label="Email"
                            value={email}
                            type='email'
                            onChange={(v) => setEmail(v.target.value)}
                        />
                        {emailVerified ? (
                            <span className="text-green-500 flex my-2">Email verified</span>
                        ) : (
                            <span className="text-red-500 flex my-2">Email not verified</span>)}
                        <CustomButton
                            buttonText={"Save Email"}
                        />
                    </div>
                </form>

                <form onSubmit={updateUserPassword}>
                    <div className="mt-10 mb-4">
                        <TextField
                            fullWidth
                            label="Old Password"
                            value={oldPassword}
                            type='password'
                            onChange={(v) => setOldPassword(v.target.value)}
                        />
                    </div>
                    <div className="mb-4">
                        <TextField
                            fullWidth
                            required
                            label="New Password"
                            value={newPassword}
                            type='password'
                            onChange={(v) => setNewPassword(v.target.value)}
                        />
                    </div>
                    <CustomButton
                        buttonText={"Save Password"}
                    />
                </form>

                <form onSubmit={updateUserPesel}>
                    <div className="mt-10 mb-4">
                        <TextField
                            fullWidth
                            required
                            label="Pesel"
                            value={nationalId}
                            type='text'
                            onChange={(v) => setPesel(v.target.value)}
                        />
                    </div>
                    <CustomButton
                        buttonText={"Save Pesel"}
                    />
                </form>

                {role == Role.PATIENT && (
                    <form onSubmit={updateUserInsurance}>

                        <div>
                            <div className="mt-10 mb-4">
                                <TextField
                                    fullWidth
                                    required
                                    label="Innsurance Number"
                                    value={insuranceId}
                                    type={"text"}
                                    onChange={(v) => setInsuranceId(v.target.value)}
                                />
                            </div>
                            <CustomButton
                                buttonText={"Save Insurance Data"}
                            />
                        </div>
                    </form>
                )}


            </div>
            <ToastContainer />
        </div>
    );
};

export default UserSettings;
