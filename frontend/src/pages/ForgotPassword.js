import { useState } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { toast } from 'sonner';

const API_URL = process.env.REACT_APP_BACKEND_URL;

const ForgotPassword = () => {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await axios.post(`${API_URL}/api/auth/forgot-password`, { email });
      setSubmitted(true);
    } catch (error) {
      toast.error('Something went wrong. Please try again.');
    }
    setLoading(false);
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-8 bg-[#F9F9F8]" style={{ fontFamily: 'IBM Plex Sans, sans-serif' }}>
      <div className="w-full max-w-md">
        <div className="mb-8">
          <h2 className="text-4xl font-semibold text-[#2A2F35] tracking-tight" style={{ fontFamily: 'Work Sans, sans-serif' }}>
            Forgot Password
          </h2>
          <p className="text-[#5C6773] mt-2">
            {submitted
              ? "Check your inbox for a link to reset your password."
              : "Enter your account email and we'll send you a reset link."}
          </p>
        </div>

        {submitted ? (
          <div className="p-4 bg-white border border-[#E5E5E2] rounded-xl text-sm text-[#5C6773]" data-testid="forgot-password-confirmation">
            If <span className="font-medium text-[#2A2F35]">{email}</span> is registered with OSIOLOG, a password reset link has been sent. It expires in 1 hour. Be sure to check your spam folder if it doesn't arrive shortly.
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-[#2A2F35] mb-2">
                Email Address
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                data-testid="forgot-password-email-input"
                className="w-full px-4 py-3 bg-white border border-[#E5E5E2] rounded-xl focus:ring-2 focus:ring-[#82A098] focus:outline-none focus:ring-offset-1 text-[#2A2F35] transition-colors duration-200"
                placeholder="doctor@example.com"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              data-testid="forgot-password-submit-button"
              className="w-full py-3 bg-[#82A098] hover:bg-[#6B8A82] text-white rounded-xl font-medium transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? 'Sending...' : 'Send Reset Link'}
            </button>
          </form>
        )}

        <div className="mt-6 text-center">
          <Link
            to="/login"
            data-testid="back-to-login-link"
            className="text-[#82A098] hover:text-[#6B8A82] font-medium transition-colors duration-200"
          >
            Back to Sign In
          </Link>
        </div>
      </div>
    </div>
  );
};

export default ForgotPassword;
