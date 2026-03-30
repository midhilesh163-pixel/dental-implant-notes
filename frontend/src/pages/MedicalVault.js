import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { toast } from 'sonner';
import { ArrowLeft, Upload, Camera, CheckCircle, X } from '@phosphor-icons/react';
import { Button } from '@/components/ui/button';

const API_URL = process.env.REACT_APP_BACKEND_URL;

const PHOTO_VIEWS = [
  { id: 'front_centric', label: 'View 1: Front - Centric Occlusion' },
  { id: 'front_protrusive', label: 'View 2: Front - Protrusive' },
  { id: 'right_centric', label: 'View 3: Right - Centric Occlusion' },
  { id: 'left_centric', label: 'View 4: Left - Centric Occlusion' },
  { id: 'front_right_exclusive', label: 'View 5: Front - Right Exclusive' },
  { id: 'front_left_exclusive', label: 'View 6: Front - Left Exclusive' },
  { id: 'maxillary_occlusal', label: 'View 7: Maxillary Occlusal' },
  { id: 'mandibular_occlusal', label: 'View 8: Mandibular Occlusal' }
];

const RADIOGRAPH_VIEWS = [
  { id: 'pre_surgical', label: 'View 1: Pre-Surgical' },
  { id: 'immediate_post_surgical', label: 'View 2: Immediate Post-Surgical' },
  { id: 'immediate_post_prosthetic', label: 'View 3: Immediate Post-Prosthetic' },
  { id: 'one_year_followup', label: 'View 4: 1 Year Follow-Up' }
];

const MedicalVault = () => {
  const { patientId, implantId } = useParams();
  const navigate = useNavigate();
  const [implant, setImplant] = useState(null);
  const [patient, setPatient] = useState(null);
  const [loading, setLoading] = useState(true);
  const [photos, setPhotos] = useState({});
  const [radiographs, setRadiographs] = useState({});
  const [uploadingFiles, setUploadingFiles] = useState({});

  useEffect(() => {
    fetchData();
  }, [patientId, implantId]);

  const fetchData = async () => {
    try {
      const [patientRes, implantRes] = await Promise.all([
        axios.get(`${API_URL}/api/patients/${patientId}`, { withCredentials: true }),
        axios.get(`${API_URL}/api/implants/${implantId}`, { withCredentials: true })
      ]);
      
      setPatient(patientRes.data);
      setImplant(implantRes.data);
      
      // Load existing photos and radiographs
      if (implantRes.data.clinical_photos) {
        const photoMap = {};
        implantRes.data.clinical_photos.forEach(photo => {
          photoMap[photo.view_type] = photo;
        });
        setPhotos(photoMap);
      }
      
      if (implantRes.data.radiographs) {
        const radioMap = {};
        implantRes.data.radiographs.forEach(radio => {
          radioMap[radio.view_type] = radio;
        });
        setRadiographs(radioMap);
      }
    } catch (error) {
      toast.error('Failed to load data');
      navigate(`/patients/${patientId}`);
    } finally {
      setLoading(false);
    }
  };

  const handleFileUpload = async (file, viewType, type) => {
    const uploadKey = `${type}_${viewType}`;
    setUploadingFiles(prev => ({ ...prev, [uploadKey]: true }));

    try {
      const formData = new FormData();
      formData.append('file', file);

      const endpoint = type === 'photo' ? 'photos' : 'radiographs';
      const { data } = await axios.post(
        `${API_URL}/api/implants/${implantId}/${endpoint}?view_type=${viewType}`,
        formData,
        {
          withCredentials: true,
          headers: { 'Content-Type': 'multipart/form-data' }
        }
      );

      if (type === 'photo') {
        setPhotos(prev => ({ ...prev, [viewType]: data }));
      } else {
        setRadiographs(prev => ({ ...prev, [viewType]: data }));
      }

      toast.success('File uploaded successfully');
    } catch (error) {
      toast.error(error.response?.data?.detail || 'Failed to upload file');
    } finally {
      setUploadingFiles(prev => ({ ...prev, [uploadKey]: false }));
    }
  };

  const getUploadProgress = () => {
    const totalPhotos = PHOTO_VIEWS.length;
    const totalRadiographs = RADIOGRAPH_VIEWS.length;
    const uploadedPhotos = Object.keys(photos).length;
    const uploadedRadiographs = Object.keys(radiographs).length;
    const total = totalPhotos + totalRadiographs;
    const uploaded = uploadedPhotos + uploadedRadiographs;
    return { uploaded, total, percentage: Math.round((uploaded / total) * 100) };
  };

  const handleSubmit = () => {
    const progress = getUploadProgress();
    if (progress.uploaded < progress.total) {
      toast.warning(`Please upload all required files (${progress.uploaded}/${progress.total} completed)`);
      return;
    }
    toast.success('All files uploaded successfully');
    navigate(`/patients/${patientId}`);
  };

  if (loading) {
    return (
      <div className="p-8">
        <div className="animate-pulse space-y-4">
          <div className="h-8 bg-[#E5E5E2] rounded w-1/4"></div>
          <div className="h-64 bg-[#E5E5E2] rounded-xl"></div>
        </div>
      </div>
    );
  }

  const progress = getUploadProgress();

  return (
    <div className="p-8" style={{ fontFamily: 'IBM Plex Sans, sans-serif' }}>
      <button
        onClick={() => navigate(`/patients/${patientId}`)}
        data-testid="back-button"
        className="flex items-center gap-2 text-[#5C6773] hover:text-[#82A098] mb-6 transition-colors duration-200"
      >
        <ArrowLeft size={20} />
        Back to Patient
      </button>

      <div className="mb-8">
        <div className="flex items-center justify-between mb-2">
          <div>
            <h1 className="text-3xl font-semibold text-[#2A2F35] tracking-tight" style={{ fontFamily: 'Work Sans, sans-serif' }}>
              Medical-Legal Vault
            </h1>
            <p className="text-[#5C6773] mt-1">Post-Operative Compliance</p>
          </div>
          <div className="text-right">
            <p className="text-sm text-[#5C6773] uppercase tracking-wider">Case Number Reference</p>
            <p className="text-lg font-medium text-[#2A2F35]">{implant?.case_number || 'N/A'}</p>
          </div>
        </div>
        
        {/* Progress Bar */}
        <div className="mt-4">
          <div className="flex items-center justify-between text-sm text-[#5C6773] mb-2">
            <span>Upload Progress</span>
            <span className="font-medium">{progress.uploaded} of {progress.total} slots completed</span>
          </div>
          <div className="w-full h-2 bg-[#E5E5E2] rounded-full overflow-hidden">
            <div 
              className="h-full bg-[#82A098] transition-all duration-500 rounded-full"
              style={{ width: `${progress.percentage}%` }}
            ></div>
          </div>
        </div>
      </div>

      {/* Patient Info Card */}
      <div className="bg-white border border-[#E5E5E2] rounded-xl p-4 mb-6 flex items-center justify-between">
        <div>
          <p className="text-sm text-[#5C6773]">Patient</p>
          <p className="text-lg font-medium text-[#2A2F35]">{patient?.name}</p>
        </div>
        <div>
          <p className="text-sm text-[#5C6773]">Tooth Number</p>
          <p className="text-lg font-medium text-[#2A2F35]">#{implant?.tooth_number}</p>
        </div>
        <div>
          <p className="text-sm text-[#5C6773]">Implant Type</p>
          <p className="text-lg font-medium text-[#2A2F35]">{implant?.implant_type}</p>
        </div>
      </div>

      {/* Clinical Photographs */}
      <div className="bg-white border border-[#E5E5E2] rounded-xl p-6 mb-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-medium text-[#2A2F35]" style={{ fontFamily: 'Work Sans, sans-serif' }}>
            <Camera size={24} className="inline mr-2" />
            Clinical Photographs (Post-Op, Min. 1 Year)
          </h2>
          <span className="text-sm text-[#5C6773]">8 slots required</span>
        </div>
        
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {PHOTO_VIEWS.map(view => {
            const isUploaded = !!photos[view.id];
            const isUploading = uploadingFiles[`photo_${view.id}`];
            
            return (
              <div key={view.id} className="border border-[#E5E5E2] rounded-lg p-3">
                <p className="text-xs text-[#5C6773] mb-2 min-h-[32px]">{view.label}</p>
                {isUploaded ? (
                  <div className="relative aspect-square bg-[#F0F0EE] rounded-lg overflow-hidden group">
                    <img
                      src={`${API_URL}/api/files/${photos[view.id].storage_path}`}
                      alt={view.label}
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-50 transition-all duration-200 flex items-center justify-center">
                      <div className="absolute top-2 right-2 bg-[#82A098] text-white rounded-full p-1">
                        <CheckCircle size={16} weight="fill" />
                      </div>
                    </div>
                  </div>
                ) : (
                  <label className="aspect-square bg-[#F9F9F8] border-2 border-dashed border-[#E5E5E2] rounded-lg flex flex-col items-center justify-center cursor-pointer hover:border-[#82A098] hover:bg-white transition-all duration-200">
                    <input
                      type="file"
                      accept="image/*"
                      className="hidden"
                      onChange={(e) => {
                        if (e.target.files[0]) {
                          handleFileUpload(e.target.files[0], view.id, 'photo');
                        }
                      }}
                      disabled={isUploading}
                    />
                    {isUploading ? (
                      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#82A098]"></div>
                    ) : (
                      <>
                        <Upload size={24} className="text-[#5C6773] mb-2" />
                        <span className="text-xs text-[#5C6773]">Upload</span>
                      </>
                    )}
                  </label>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* OPG Radiographs */}
      <div className="bg-white border border-[#E5E5E2] rounded-xl p-6 mb-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-medium text-[#2A2F35]" style={{ fontFamily: 'Work Sans, sans-serif' }}>
            <Camera size={24} className="inline mr-2" />
            OPG Radiographs (Min. 1 Year)
          </h2>
          <span className="text-sm text-[#5C6773]">4 slots required</span>
        </div>
        
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {RADIOGRAPH_VIEWS.map(view => {
            const isUploaded = !!radiographs[view.id];
            const isUploading = uploadingFiles[`radiograph_${view.id}`];
            
            return (
              <div key={view.id} className="border border-[#E5E5E2] rounded-lg p-3">
                <p className="text-xs text-[#5C6773] mb-2 min-h-[32px]">{view.label}</p>
                {isUploaded ? (
                  <div className="relative aspect-square bg-[#F0F0EE] rounded-lg overflow-hidden group">
                    <img
                      src={`${API_URL}/api/files/${radiographs[view.id].storage_path}`}
                      alt={view.label}
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-50 transition-all duration-200 flex items-center justify-center">
                      <div className="absolute top-2 right-2 bg-[#82A098] text-white rounded-full p-1">
                        <CheckCircle size={16} weight="fill" />
                      </div>
                    </div>
                  </div>
                ) : (
                  <label className="aspect-square bg-[#F9F9F8] border-2 border-dashed border-[#E5E5E2] rounded-lg flex flex-col items-center justify-center cursor-pointer hover:border-[#82A098] hover:bg-white transition-all duration-200">
                    <input
                      type="file"
                      accept="image/*"
                      className="hidden"
                      onChange={(e) => {
                        if (e.target.files[0]) {
                          handleFileUpload(e.target.files[0], view.id, 'radiograph');
                        }
                      }}
                      disabled={isUploading}
                    />
                    {isUploading ? (
                      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#82A098]"></div>
                    ) : (
                      <>
                        <Upload size={24} className="text-[#5C6773] mb-2" />
                        <span className="text-xs text-[#5C6773]">Upload</span>
                      </>
                    )}
                  </label>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex justify-between items-center">
        <button
          onClick={() => navigate(`/patients/${patientId}`)}
          className="px-6 py-3 border border-[#E5E5E2] rounded-xl text-[#2A2F35] hover:bg-[#F9F9F8] transition-colors duration-200"
        >
          Save Draft
        </button>
        
        <Button
          onClick={handleSubmit}
          data-testid="submit-vault-button"
          className="px-8 py-3 bg-[#82A098] hover:bg-[#6B8A82] text-white rounded-xl"
        >
          Submit to Vault
        </Button>
      </div>

      {progress.uploaded < progress.total && (
        <div className="mt-4 p-4 bg-[#E8A76C]/10 border border-[#E8A76C]/30 rounded-lg">
          <p className="text-sm text-[#2A2F35]">
            <strong>Note:</strong> Please upload all {progress.total} required files before submitting to vault.
          </p>
        </div>
      )}
    </div>
  );
};

export default MedicalVault;
