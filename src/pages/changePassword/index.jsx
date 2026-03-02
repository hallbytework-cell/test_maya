import React, { useState } from 'react';
import { useForm } from 'react-hook-form';

const ChangePasswordPage = () => {
  const [errorMessage, setErrorMessage] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const { register, handleSubmit, formState: { errors } } = useForm();

  const onSubmit = async (data) => {
    const { currentPassword, newPassword, confirmPassword } = data;

    if (newPassword !== confirmPassword) {
      setErrorMessage('New password and confirm password must match.');
      return;
    }

    try {
      // Make your API call here to change the password
      const response = await fetch('/api/change-password', {
        method: 'POST',
        body: JSON.stringify({
          currentPassword,
          newPassword,
        }),
        headers: {
          'Content-Type': 'application/json',
        },
      });

      const result = await response.json();

      if (response.ok) {
        setSuccessMessage('Password changed successfully!');
        setErrorMessage('');
      } else {
        setErrorMessage(result.message || 'Failed to change password.');
        setSuccessMessage('');
      }
    } catch (error) {
      setErrorMessage('Something went wrong, please try again.');
    }
  };

  return (
    <div className="container mx-auto p-6">
      <h2 className="text-2xl font-bold text-center mb-4">Change Password</h2>
      <form onSubmit={handleSubmit(onSubmit)} className="max-w-md mx-auto p-4 border rounded-md shadow-md">
        {/* Current Password */}
        <div className="mb-4">
          <label htmlFor="currentPassword" className="block text-sm font-medium text-gray-700">
            Current Password
          </label>
          <input
            id="currentPassword"
            type="password"
            {...register('currentPassword', { required: 'Current password is required' })}
            className="w-full p-2 border rounded-md mt-2"
          />
          {errors.currentPassword && (
            <span className="text-red-500 text-sm">{errors.currentPassword.message}</span>
          )}
        </div>

        {/* New Password */}
        <div className="mb-4">
          <label htmlFor="newPassword" className="block text-sm font-medium text-gray-700">
            New Password
          </label>
          <input
            id="newPassword"
            type="password"
            {...register('newPassword', { required: 'New password is required' })}
            className="w-full p-2 border rounded-md mt-2"
          />
          {errors.newPassword && (
            <span className="text-red-500 text-sm">{errors.newPassword.message}</span>
          )}
        </div>

        {/* Confirm New Password */}
        <div className="mb-4">
          <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700">
            Confirm New Password
          </label>
          <input
            id="confirmPassword"
            type="password"
            {...register('confirmPassword', { required: 'Please confirm your new password' })}
            className="w-full p-2 border rounded-md mt-2"
          />
          {errors.confirmPassword && (
            <span className="text-red-500 text-sm">{errors.confirmPassword.message}</span>
          )}
        </div>

        {/* Error or Success Message */}
        {errorMessage && <div className="text-red-500 mb-4">{errorMessage}</div>}
        {successMessage && <div className="text-green-500 mb-4">{successMessage}</div>}

        {/* Submit Button */}
        <button
          type="submit"
          className="w-full bg-green-600 text-white py-2 rounded-md hover:bg-green-700"
        >
          Change Password
        </button>
      </form>
    </div>
  );
};

export default ChangePasswordPage;
