import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { toast } from 'sonner';
import { Tooth } from '@phosphor-icons/react';

const COUNTRIES = {
  India: {
    registrationLabel: 'MCI Registration Number',
    colleges: ['AIIMS Delhi', 'Manipal College of Dental Sciences', 'Dr. D.Y. Patil Dental College', 'Other']
  },
  USA: {
    registrationLabel: 'State License Number',
    colleges: ['Harvard School of Dental Medicine', 'UCLA School of Dentistry', 'NYU College of Dentistry', 'Other']
  },
  Europe: {
    registrationLabel: 'GMC/GDC Registration Number',
    colleges: ['King\'s College London', 'University of Barcelona', 'University of Zurich', 'Other']
  }
};

const Register = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    phone: '',
    country: 'USA',
    registration_number: '',
    college: '',
    specialization: ''
  });
  const [loading, setLoading] = useState(false);
  const { register } = useAuth();
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value,
      ...(name === 'country' ? { college: '' } : {})
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    const result = await register(formData);
    
    if (result.success) {
      toast.success('Registration successful!');
      navigate('/');
    } else {
      toast.error(result.error);
    }
    
    setLoading(false);
  };

  const countryData = COUNTRIES[formData.country] || COUNTRIES.USA;

  return (
    <div className="min-h-screen flex" style={{ fontFamily: 'IBM Plex Sans, sans-serif' }}>
      {/* Left Side - Image */}
      <div 
        className="hidden lg:flex lg:w-1/2 bg-cover bg-center relative"
        style={{
          backgroundImage: 'url(https://images.pexels.com/photos/1029624/pexels-photo-1029624.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=650&w=940)'
        }}
      >
        <div className="absolute inset-0 bg-[#82A098] opacity-20"></div>
        <div className="relative z-10 flex items-center justify-center w-full p-12">
          <div className="text-white">
            <Tooth size={64} weight="fill" />
            <h1 className="text-5xl font-semibold mt-6" style={{ fontFamily: 'Work Sans, sans-serif' }}>DentalHub</h1>
            <p className="text-xl mt-4 opacity-90">Join the Professional Network</p>
          </div>
        </div>
      </div>

      {/* Right Side - Register Form */}
      <div className="flex-1 flex items-center justify-center p-8 bg-[#F9F9F8] overflow-y-auto">
        <div className="w-full max-w-md py-8">
          <div className="mb-8">
            <h2 className="text-4xl font-semibold text-[#2A2F35] tracking-tight" style={{ fontFamily: 'Work Sans, sans-serif' }}>Create Account</h2>
            <p className="text-[#5C6773] mt-2">Register as a dental professional</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="block text-sm font-medium text-[#2A2F35] mb-2">Full Name</label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                required
                data-testid="name-input"
                className="w-full px-4 py-3 bg-white border border-[#E5E5E2] rounded-xl focus:ring-2 focus:ring-[#82A098] focus:outline-none focus:ring-offset-1 text-[#2A2F35] transition-colors duration-200"
                placeholder="Dr. John Smith"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-[#2A2F35] mb-2">Email Address</label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                required
                data-testid="email-input"
                className="w-full px-4 py-3 bg-white border border-[#E5E5E2] rounded-xl focus:ring-2 focus:ring-[#82A098] focus:outline-none focus:ring-offset-1 text-[#2A2F35] transition-colors duration-200"
                placeholder="doctor@example.com"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-[#2A2F35] mb-2">Password</label>
              <input
                type="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                required
                data-testid="password-input"
                className="w-full px-4 py-3 bg-white border border-[#E5E5E2] rounded-xl focus:ring-2 focus:ring-[#82A098] focus:outline-none focus:ring-offset-1 text-[#2A2F35] transition-colors duration-200"
                placeholder="••••••••"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-[#2A2F35] mb-2">Phone Number</label>
              <input
                type="tel"
                name="phone"
                value={formData.phone}
                onChange={handleChange}
                required
                data-testid="phone-input"
                className="w-full px-4 py-3 bg-white border border-[#E5E5E2] rounded-xl focus:ring-2 focus:ring-[#82A098] focus:outline-none focus:ring-offset-1 text-[#2A2F35] transition-colors duration-200"
                placeholder="+1 234 567 8900"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-[#2A2F35] mb-2">Country</label>
              <select
                name="country"
                value={formData.country}
                onChange={handleChange}
                required
                data-testid="country-select"
                className="w-full px-4 py-3 bg-white border border-[#E5E5E2] rounded-xl focus:ring-2 focus:ring-[#82A098] focus:outline-none focus:ring-offset-1 text-[#2A2F35] transition-colors duration-200"
              >
                <option value="USA">United States</option>
                <option value="India">India</option>
                <option value="Europe">Europe</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-[#2A2F35] mb-2">
                {countryData.registrationLabel}
              </label>
              <input
                type="text"
                name="registration_number"
                value={formData.registration_number}
                onChange={handleChange}
                required
                data-testid="registration-input"
                className="w-full px-4 py-3 bg-white border border-[#E5E5E2] rounded-xl focus:ring-2 focus:ring-[#82A098] focus:outline-none focus:ring-offset-1 text-[#2A2F35] transition-colors duration-200"
                placeholder="Enter your registration number"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-[#2A2F35] mb-2">College/University</label>
              <select
                name="college"
                value={formData.college}
                onChange={handleChange}
                required
                data-testid="college-select"
                className="w-full px-4 py-3 bg-white border border-[#E5E5E2] rounded-xl focus:ring-2 focus:ring-[#82A098] focus:outline-none focus:ring-offset-1 text-[#2A2F35] transition-colors duration-200"
              >
                <option value="">Select your college</option>
                {countryData.colleges.map(college => (
                  <option key={college} value={college}>{college}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-[#2A2F35] mb-2">Specialization</label>
              <input
                type="text"
                name="specialization"
                value={formData.specialization}
                onChange={handleChange}
                required
                data-testid="specialization-input"
                className="w-full px-4 py-3 bg-white border border-[#E5E5E2] rounded-xl focus:ring-2 focus:ring-[#82A098] focus:outline-none focus:ring-offset-1 text-[#2A2F35] transition-colors duration-200"
                placeholder="e.g., Implantology, Prosthodontics"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              data-testid="register-submit-button"
              className="w-full py-3 bg-[#82A098] hover:bg-[#6B8A82] text-white rounded-xl font-medium transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? 'Creating account...' : 'Create Account'}
            </button>
          </form>

          <div className="mt-6 text-center">
            <p className="text-[#5C6773]">
              Already have an account?{' '}
              <Link 
                to="/login" 
                data-testid="login-link"
                className="text-[#82A098] hover:text-[#6B8A82] font-medium transition-colors duration-200"
              >
                Sign in
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Register;