import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { getProfile, updateProfile } from "../services/api";

const Profile = () => {
    const [profile, setProfile] = useState(null);
    const [editMode, setEditMode] = useState(false);
    const [formData, setFormData] = useState({
        fullName: "",
        email: "",
    });
    const [error, setError] = useState("");
    const navigate = useNavigate();

    useEffect(() => {
        const token = localStorage.getItem("token");
        if (!token) {
            navigate("/login", { replace: true });
        }
    }, [navigate]);

    useEffect(() => {
        const fetchProfile = async () => {
            try {
                const res = await getProfile();
                setProfile(res.data);
                setFormData({
                    fullName: res.data.fullName || "",
                    email: res.data.email || "",
                });
            } catch (err) {
                console.error(err);
                setError("Failed to load profile.");
            }
        };

        if (localStorage.getItem("token")) {
            fetchProfile();
        }
    }, []);

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError("");

        try {
            await updateProfile(formData);
            setEditMode(false);
            const res = await getProfile();
            setProfile(res.data);
        } catch (err) {
            console.error(err);
            setError("Failed to update profile.");
        }
    };

    if (!profile) return <p className="text-center mt-5">Loading...</p>;

    return (
        <div className="container mt-5">
            <div className="row justify-content-center">
                <div className="col-md-6">
                    <div className="card p-4 shadow">
                        <h2 className="text-center mb-4">Profile</h2>

                        {!editMode ? (
                            <div>
                                <p><strong>Name:</strong> {profile.fullName}</p>
                                <p><strong>Email:</strong> {profile.email}</p>
                                <p><strong>User ID:</strong> <code>{profile.id}</code></p>
                                <small className="text-muted">
                                    Share your User ID with others to receive transfers.
                                </small>
                                <br />
                                <button className="btn btn-primary mt-3" onClick={() => setEditMode(true)}>
                                    Edit Profile
                                </button>
                            </div>
                        ) : (
                            <form onSubmit={handleSubmit}>
                                <div className="mb-3">
                                    <label className="form-label">Full Name</label>
                                    <input
                                        type="text"
                                        name="fullName"
                                        className="form-control"
                                        value={formData.fullName}
                                        onChange={handleChange}
                                        required
                                    />
                                </div>
                                <div className="mb-3">
                                    <label className="form-label">Email</label>
                                    <input
                                        type="email"
                                        name="email"
                                        className="form-control"
                                        value={formData.email}
                                        onChange={handleChange}
                                        required
                                    />
                                </div>
                                <button type="submit" className="btn btn-success me-2">Save</button>
                                <button
                                    type="button"
                                    className="btn btn-secondary"
                                    onClick={() => setEditMode(false)}
                                >
                                    Cancel
                                </button>
                            </form>
                        )}

                        {error && <div className="alert alert-danger mt-3">{error}</div>}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Profile;
