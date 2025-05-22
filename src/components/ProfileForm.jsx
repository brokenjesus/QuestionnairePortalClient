import React from 'react';

const ProfileForm = ({
                         profile,
                         loading,
                         error,
                         success,
                         handleChange,
                         handleSubmit
                     }) => {
    return (
        <div className="container d-flex justify-content-center align-items-center" style={{ minHeight: '30vh' }}>
            <div className="card p-4 shadow-sm" style={{ width: '500px' }}>
                {/* Заголовок с нижней границей */}
                <h4 className="mb-4 text-start pb-2 border-bottom">Edit Profile</h4>

                {error && <div className="alert alert-danger text-start">{error}</div>}
                {success && <div className="alert alert-success text-start">{success}</div>}

                <form onSubmit={handleSubmit}>
                    <div className="mb-3 text-start">
                        <label className="form-label">First Name</label>
                        <input
                            type="text"
                            className="form-control"
                            name="firstName"
                            value={profile.firstName}
                            onChange={handleChange}
                            required
                        />
                    </div>
                    <div className="mb-3 text-start">
                        <label className="form-label">Last Name</label>
                        <input
                            type="text"
                            className="form-control"
                            name="lastName"
                            value={profile.lastName}
                            onChange={handleChange}
                            required
                        />
                    </div>
                    <div className="mb-3 text-start">
                        <label className="form-label">Email</label>
                        <input
                            type="email"
                            className="form-control"
                            name="email"
                            value={profile.email}
                            onChange={handleChange}
                            required
                        />
                    </div>
                    <div className="mb-4 text-start">
                        <label className="form-label">Phone Number</label>
                        <input
                            type="tel"
                            className="form-control"
                            name="phoneNumber"
                            value={profile.phoneNumber}
                            onChange={handleChange}
                        />
                    </div>
                    <button type="submit" className="btn btn-primary w-50" disabled={loading}>
                        {loading ? 'Updating...' : 'SAVE'}
                    </button>
                </form>
            </div>
        </div>
    );
};

export default ProfileForm;