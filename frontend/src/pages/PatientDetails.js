import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { toast } from 'sonner';
import { ArrowLeft, Plus, Tooth } from '@phosphor-icons/react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

const API_URL = process.env.REACT_APP_BACKEND_URL;

const FDI_CHART = {
  upper: [
    [18, 17, 16, 15, 14, 13, 12, 11],
    [21, 22, 23, 24, 25, 26, 27, 28]
  ],
  lower: [
    [48, 47, 46, 45, 44, 43, 42, 41],
    [31, 32, 33, 34, 35, 36, 37, 38]
  ]
};

const PatientDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [patient, setPatient] = useState(null);
  const [implants, setImplants] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [selectedTooth, setSelectedTooth] = useState(null);
  const [formData, setFormData] = useState({
    tooth_number: '',
    implant_type: 'Single',
    brand: '',
    size: '',
    length: '',
    insertion_torque: '',
    connection_type: 'Internal Hex',
    surgical_approach: 'Immediate Placement',
    bone_graft: '',
    sinus_lift_type: '',
    is_pterygoid: false,
    is_zygomatic: false,
    is_subperiosteal: false,
    notes: '',
    // Enhanced fields
    adjunctive_procedures: [],
    clinical_notes: '',
    surgery_date: '',
    prosthetic_loading_date: '',
    implant_outcome: 'Pending',
    medical_red_flags: [],
    diameter_mm: '',
    length_mm: '',
    osseointegration_success: false,
    peri_implant_health: false,
    site_specific_notes: '',
    complication_remarks: ''
  });

  useEffect(() => {
    fetchPatientAndImplants();
  }, [id]);

  const fetchPatientAndImplants = async () => {
    try {
      const [patientRes, implantsRes] = await Promise.all([
        axios.get(`${API_URL}/api/patients/${id}`, { withCredentials: true }),
        axios.get(`${API_URL}/api/implants?patient_id=${id}`, { withCredentials: true })
      ]);
      setPatient(patientRes.data);
      setImplants(implantsRes.data);
    } catch (error) {
      toast.error('Failed to fetch patient details');
      navigate('/patients');
    } finally {
      setLoading(false);
    }
  };

  const handleToothClick = (toothNumber) => {
    setSelectedTooth(toothNumber);
    setFormData({...formData, tooth_number: toothNumber});
    setIsDialogOpen(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const payload = {
        ...formData,
        patient_id: id,
        tooth_number: parseInt(formData.tooth_number),
        insertion_torque: formData.insertion_torque ? parseFloat(formData.insertion_torque) : null,
        bone_graft: formData.bone_graft || null,
        sinus_lift_type: formData.sinus_lift_type || null,
        diameter_mm: formData.diameter_mm ? parseFloat(formData.diameter_mm) : null,
        length_mm: formData.length_mm ? parseFloat(formData.length_mm) : null
      };
      await axios.post(`${API_URL}/api/implants`, payload, { withCredentials: true });
      toast.success('Implant record added successfully');
      setIsDialogOpen(false);
      resetForm();
      fetchPatientAndImplants();
    } catch (error) {
      toast.error('Failed to add implant');
    }
  };

  const resetForm = () => {
    setFormData({
      tooth_number: '',
      implant_type: 'Single',
      brand: '',
      size: '',
      length: '',
      insertion_torque: '',
      connection_type: 'Internal Hex',
      surgical_approach: 'Immediate Placement',
      bone_graft: '',
      sinus_lift_type: '',
      is_pterygoid: false,
      is_zygomatic: false,
      is_subperiosteal: false,
      notes: '',
      adjunctive_procedures: [],
      clinical_notes: '',
      surgery_date: '',
      prosthetic_loading_date: '',
      implant_outcome: 'Pending',
      medical_red_flags: [],
      diameter_mm: '',
      length_mm: '',
      osseointegration_success: false,
      peri_implant_health: false,
      site_specific_notes: '',
      complication_remarks: ''
    });
    setSelectedTooth(null);
  };

  const getToothStatus = (toothNumber) => {
    return implants.find(imp => imp.tooth_number === toothNumber);
  };

  const getDaysRemaining = (osseoDate) => {
    const days = Math.ceil((new Date(osseoDate) - new Date()) / (1000 * 60 * 60 * 24));
    return days > 0 ? days : 0;
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

  return (
    <div className="p-8" style={{ fontFamily: 'IBM Plex Sans, sans-serif' }}>
      <button
        onClick={() => navigate('/patients')}
        data-testid="back-button"
        className="flex items-center gap-2 text-[#5C6773] hover:text-[#82A098] mb-6 transition-colors duration-200"
      >
        <ArrowLeft size={20} />
        Back to Patients
      </button>

      {/* Patient Info */}
      <div className="bg-white border border-[#E5E5E2] rounded-xl p-6 shadow-sm mb-8">
        <div className="flex items-start justify-between">
          <div className="flex items-start gap-4">
            <div className="w-16 h-16 rounded-full bg-[#82A098] flex items-center justify-center text-white font-medium text-2xl">
              {patient.name.charAt(0)}
            </div>
            <div>
              <h1 className="text-3xl font-semibold text-[#2A2F35] tracking-tight" style={{ fontFamily: 'Work Sans, sans-serif' }}>
                {patient.name}
              </h1>
              <div className="flex gap-4 mt-2 text-sm text-[#5C6773]">
                <span>{patient.age} years</span>
                <span>•</span>
                <span>{patient.gender}</span>
                <span>•</span>
                <span>{patient.phone}</span>
              </div>
              {patient.medical_history && (
                <p className="mt-3 text-sm text-[#5C6773]">
                  <span className="font-medium text-[#2A2F35]">Medical History:</span> {patient.medical_history}
                </p>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* FDI Dental Chart */}
      <div className="bg-white border border-[#E5E5E2] rounded-xl p-6 shadow-sm mb-8">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-medium text-[#2A2F35]" style={{ fontFamily: 'Work Sans, sans-serif' }}>
            FDI Dental Chart
          </h2>
          <Dialog open={isDialogOpen} onOpenChange={(open) => {
            setIsDialogOpen(open);
            if (!open) resetForm();
          }}>
            <DialogTrigger asChild>
              <Button 
                data-testid="add-implant-button"
                className="bg-[#82A098] hover:bg-[#6B8A82] text-white"
              >
                <Plus size={20} weight="bold" className="mr-2" />
                Add Implant
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
              <DialogHeader>
                <DialogTitle className="text-2xl font-semibold" style={{ fontFamily: 'Work Sans, sans-serif' }}>
                  {selectedTooth ? `Add Implant - Tooth #${selectedTooth}` : 'Add Implant Record'}
                </DialogTitle>
              </DialogHeader>
              <form onSubmit={handleSubmit}>
                <Tabs defaultValue="basic" className="mt-4">
                  <TabsList className="grid w-full grid-cols-3">
                    <TabsTrigger value="basic">Basic Info</TabsTrigger>
                    <TabsTrigger value="specs">Specifications</TabsTrigger>
                    <TabsTrigger value="advanced">Advanced</TabsTrigger>
                  </TabsList>

                  <TabsContent value="basic" className="space-y-4 mt-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <Label>Tooth Number *</Label>
                        <Input
                          type="number"
                          value={formData.tooth_number}
                          onChange={(e) => setFormData({...formData, tooth_number: e.target.value})}
                          required
                          data-testid="tooth-number-input"
                          className="mt-1"
                        />
                      </div>
                      <div>
                        <Label>Implant Type *</Label>
                        <select
                          value={formData.implant_type}
                          onChange={(e) => setFormData({...formData, implant_type: e.target.value})}
                          data-testid="implant-type-select"
                          className="mt-1 w-full px-3 py-2 bg-white border border-[#E5E5E2] rounded-md focus:ring-2 focus:ring-[#82A098] focus:outline-none"
                        >
                          <option>Single</option>
                          <option>Bridge</option>
                          <option>Full Mouth</option>
                        </select>
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <Label>Brand *</Label>
                        <Input
                          value={formData.brand}
                          onChange={(e) => setFormData({...formData, brand: e.target.value})}
                          required
                          data-testid="brand-input"
                          placeholder="e.g., Straumann, Nobel Biocare"
                          className="mt-1"
                        />
                      </div>
                      <div>
                        <Label>Surgical Approach *</Label>
                        <select
                          value={formData.surgical_approach}
                          onChange={(e) => setFormData({...formData, surgical_approach: e.target.value})}
                          data-testid="surgical-approach-select"
                          className="mt-1 w-full px-3 py-2 bg-white border border-[#E5E5E2] rounded-md focus:ring-2 focus:ring-[#82A098] focus:outline-none"
                        >
                          <option>Immediate Placement</option>
                          <option>Delayed Placement</option>
                        </select>
                      </div>
                    </div>
                  </TabsContent>

                  <TabsContent value="specs" className="space-y-4 mt-4">
                    <div className="grid grid-cols-3 gap-4">
                      <div>
                        <Label>Size *</Label>
                        <Input
                          value={formData.size}
                          onChange={(e) => setFormData({...formData, size: e.target.value})}
                          required
                          data-testid="size-input"
                          placeholder="e.g., 4.1mm"
                          className="mt-1"
                        />
                      </div>
                      <div>
                        <Label>Length *</Label>
                        <Input
                          value={formData.length}
                          onChange={(e) => setFormData({...formData, length: e.target.value})}
                          required
                          data-testid="length-input"
                          placeholder="e.g., 10mm"
                          className="mt-1"
                        />
                      </div>
                      <div>
                        <Label>Insertion Torque (Ncm)</Label>
                        <Input
                          type="number"
                          step="0.1"
                          value={formData.insertion_torque}
                          onChange={(e) => setFormData({...formData, insertion_torque: e.target.value})}
                          data-testid="torque-input"
                          placeholder="e.g., 35"
                          className="mt-1"
                        />
                      </div>
                    </div>

                    <div>
                      <Label>Connection Type *</Label>
                      <select
                        value={formData.connection_type}
                        onChange={(e) => setFormData({...formData, connection_type: e.target.value})}
                        data-testid="connection-type-select"
                        className="mt-1 w-full px-3 py-2 bg-white border border-[#E5E5E2] rounded-md focus:ring-2 focus:ring-[#82A098] focus:outline-none"
                      >
                        <option>Internal Hex</option>
                        <option>External Hex</option>
                        <option>Conical</option>
                        <option>Morse Taper</option>
                      </select>
                    </div>
                  </TabsContent>

                  <TabsContent value="advanced" className="space-y-4 mt-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <Label>Surgery Date</Label>
                        <Input
                          type="date"
                          value={formData.surgery_date}
                          onChange={(e) => setFormData({...formData, surgery_date: e.target.value})}
                          className="mt-1"
                        />
                      </div>
                      <div>
                        <Label>Prosthetic Loading Date</Label>
                        <Input
                          type="date"
                          value={formData.prosthetic_loading_date}
                          onChange={(e) => setFormData({...formData, prosthetic_loading_date: e.target.value})}
                          className="mt-1"
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <Label>Bone Graft</Label>
                        <Input
                          value={formData.bone_graft}
                          onChange={(e) => setFormData({...formData, bone_graft: e.target.value})}
                          data-testid="bone-graft-input"
                          placeholder="e.g., Xenograft, Allograft"
                          className="mt-1"
                        />
                      </div>
                      <div>
                        <Label>Sinus Lift Type</Label>
                        <select
                          value={formData.sinus_lift_type}
                          onChange={(e) => setFormData({...formData, sinus_lift_type: e.target.value})}
                          data-testid="sinus-lift-select"
                          className="mt-1 w-full px-3 py-2 bg-white border border-[#E5E5E2] rounded-md focus:ring-2 focus:ring-[#82A098] focus:outline-none"
                        >
                          <option value="">None</option>
                          <option>Direct</option>
                          <option>Indirect</option>
                        </select>
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <Label>Diameter (mm)</Label>
                        <Input
                          type="number"
                          step="0.1"
                          value={formData.diameter_mm}
                          onChange={(e) => setFormData({...formData, diameter_mm: e.target.value})}
                          placeholder="e.g., 4.5"
                          className="mt-1"
                        />
                      </div>
                      <div>
                        <Label>Length (mm)</Label>
                        <Input
                          type="number"
                          step="0.1"
                          value={formData.length_mm}
                          onChange={(e) => setFormData({...formData, length_mm: e.target.value})}
                          placeholder="e.g., 10.0"
                          className="mt-1"
                        />
                      </div>
                    </div>

                    <div className="space-y-3">
                      <label className="flex items-center gap-2">
                        <input
                          type="checkbox"
                          checked={formData.is_pterygoid}
                          onChange={(e) => setFormData({...formData, is_pterygoid: e.target.checked})}
                          data-testid="pterygoid-checkbox"
                          className="w-4 h-4 text-[#82A098] border-[#E5E5E2] rounded focus:ring-[#82A098]"
                        />
                        <span className="text-sm text-[#2A2F35]">Pterygoid Implant</span>
                      </label>
                      <label className="flex items-center gap-2">
                        <input
                          type="checkbox"
                          checked={formData.is_zygomatic}
                          onChange={(e) => setFormData({...formData, is_zygomatic: e.target.checked})}
                          data-testid="zygomatic-checkbox"
                          className="w-4 h-4 text-[#82A098] border-[#E5E5E2] rounded focus:ring-[#82A098]"
                        />
                        <span className="text-sm text-[#2A2F35]">Zygomatic Implant</span>
                      </label>
                      <label className="flex items-center gap-2">
                        <input
                          type="checkbox"
                          checked={formData.is_subperiosteal}
                          onChange={(e) => setFormData({...formData, is_subperiosteal: e.target.checked})}
                          data-testid="subperiosteal-checkbox"
                          className="w-4 h-4 text-[#82A098] border-[#E5E5E2] rounded focus:ring-[#82A098]"
                        />
                        <span className="text-sm text-[#2A2F35]">Sub-periosteal Implant</span>
                      </label>
                      <label className="flex items-center gap-2">
                        <input
                          type="checkbox"
                          checked={formData.osseointegration_success}
                          onChange={(e) => setFormData({...formData, osseointegration_success: e.target.checked})}
                          className="w-4 h-4 text-[#82A098] border-[#E5E5E2] rounded focus:ring-[#82A098]"
                        />
                        <span className="text-sm text-[#2A2F35]">Osseointegration Success</span>
                      </label>
                      <label className="flex items-center gap-2">
                        <input
                          type="checkbox"
                          checked={formData.peri_implant_health}
                          onChange={(e) => setFormData({...formData, peri_implant_health: e.target.checked})}
                          className="w-4 h-4 text-[#82A098] border-[#E5E5E2] rounded focus:ring-[#82A098]"
                        />
                        <span className="text-sm text-[#2A2F35]">Peri-implant Health</span>
                      </label>
                    </div>

                    <div>
                      <Label>Additional Notes</Label>
                      <textarea
                        value={formData.notes}
                        onChange={(e) => setFormData({...formData, notes: e.target.value})}
                        data-testid="notes-input"
                        rows={4}
                        className="mt-1 w-full px-3 py-2 bg-white border border-[#E5E5E2] rounded-md focus:ring-2 focus:ring-[#82A098] focus:outline-none"
                        placeholder="Any additional information..."
                      />
                    </div>

                    <div>
                      <Label>Site-Specific Notes</Label>
                      <textarea
                        value={formData.site_specific_notes}
                        onChange={(e) => setFormData({...formData, site_specific_notes: e.target.value})}
                        rows={3}
                        className="mt-1 w-full px-3 py-2 bg-white border border-[#E5E5E2] rounded-md focus:ring-2 focus:ring-[#82A098] focus:outline-none"
                        placeholder="Detailed notes regarding site performance, healing patterns..."
                      />
                    </div>

                    <div>
                      <Label>Complication Remarks</Label>
                      <textarea
                        value={formData.complication_remarks}
                        onChange={(e) => setFormData({...formData, complication_remarks: e.target.value})}
                        rows={3}
                        className="mt-1 w-full px-3 py-2 bg-white border border-[#E5E5E2] rounded-md focus:ring-2 focus:ring-[#82A098] focus:outline-none"
                        placeholder="Describe any surgical complications or procedural issues..."
                      />
                    </div>
                  </TabsContent>
                </Tabs>

                <Button 
                  type="submit" 
                  data-testid="submit-implant-button"
                  className="w-full mt-6 bg-[#82A098] hover:bg-[#6B8A82] text-white"
                >
                  Add Implant Record
                </Button>
              </form>
            </DialogContent>
          </Dialog>
        </div>

        {/* Dental Chart Grid */}
        <div className="space-y-8">
          {/* Upper Teeth */}
          <div>
            <p className="text-xs text-[#5C6773] mb-3 text-center uppercase tracking-wider">Upper Jaw</p>
            <div className="flex justify-center gap-8">
              {FDI_CHART.upper.map((quadrant, qIndex) => (
                <div key={qIndex} className="flex gap-2">
                  {quadrant.map((tooth) => {
                    const implant = getToothStatus(tooth);
                    return (
                      <button
                        key={tooth}
                        onClick={() => handleToothClick(tooth)}
                        data-testid={`tooth-${tooth}`}
                        className={`w-12 h-16 rounded-lg border-2 flex flex-col items-center justify-center text-xs font-medium transition-all duration-200 ${
                          implant
                            ? 'bg-[#82A098] border-[#82A098] text-white hover:bg-[#6B8A82]'
                            : 'bg-white border-[#E5E5E2] text-[#2A2F35] hover:border-[#82A098] hover:bg-[#F9F9F8]'
                        }`}
                      >
                        <Tooth size={20} weight={implant ? 'fill' : 'regular'} />
                        <span className="mt-1">{tooth}</span>
                      </button>
                    );
                  })}
                </div>
              ))}
            </div>
          </div>

          {/* Lower Teeth */}
          <div>
            <p className="text-xs text-[#5C6773] mb-3 text-center uppercase tracking-wider">Lower Jaw</p>
            <div className="flex justify-center gap-8">
              {FDI_CHART.lower.map((quadrant, qIndex) => (
                <div key={qIndex} className="flex gap-2">
                  {quadrant.map((tooth) => {
                    const implant = getToothStatus(tooth);
                    return (
                      <button
                        key={tooth}
                        onClick={() => handleToothClick(tooth)}
                        data-testid={`tooth-${tooth}`}
                        className={`w-12 h-16 rounded-lg border-2 flex flex-col items-center justify-center text-xs font-medium transition-all duration-200 ${
                          implant
                            ? 'bg-[#82A098] border-[#82A098] text-white hover:bg-[#6B8A82]'
                            : 'bg-white border-[#E5E5E2] text-[#2A2F35] hover:border-[#82A098] hover:bg-[#F9F9F8]'
                        }`}
                      >
                        <span className="mb-1">{tooth}</span>
                        <Tooth size={20} weight={implant ? 'fill' : 'regular'} />
                      </button>
                    );
                  })}
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="mt-6 flex items-center gap-4 text-xs text-[#5C6773]">
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 bg-white border-2 border-[#E5E5E2] rounded"></div>
            <span>Healthy</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 bg-[#82A098] border-2 border-[#82A098] rounded"></div>
            <span>Has Implant</span>
          </div>
        </div>
      </div>

      {/* Implant Records */}
      {implants.length > 0 && (
        <div className="bg-white border border-[#E5E5E2] rounded-xl p-6 shadow-sm">
          <h2 className="text-xl font-medium text-[#2A2F35] mb-4" style={{ fontFamily: 'Work Sans, sans-serif' }}>
            Implant Records ({implants.length})
          </h2>
          <div className="space-y-4">
            {implants.map((implant) => {
              const daysRemaining = getDaysRemaining(implant.osseointegration_date);
              return (
                <div 
                  key={implant._id} 
                  data-testid={`implant-record-${implant._id}`}
                  className="border border-[#E5E5E2] rounded-lg p-4 hover:border-[#82A098] transition-all duration-200"
                >
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-[#82A098] rounded-lg flex items-center justify-center text-white font-medium">
                        {implant.tooth_number}
                      </div>
                      <div>
                        <h3 className="font-medium text-[#2A2F35]">{implant.implant_type} Implant</h3>
                        <p className="text-sm text-[#5C6773]">{implant.brand}</p>
                      </div>
                    </div>
                    {daysRemaining > 0 && (
                      <div className="text-right">
                        <p className="text-sm font-medium text-[#E8A76C]">{daysRemaining} days</p>
                        <p className="text-xs text-[#5C6773]">until osseointegration</p>
                      </div>
                    )}
                  </div>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-3 text-sm">
                    <div>
                      <span className="text-[#5C6773]">Size:</span>
                      <span className="ml-2 text-[#2A2F35] font-medium">{implant.size}</span>
                    </div>
                    <div>
                      <span className="text-[#5C6773]">Length:</span>
                      <span className="ml-2 text-[#2A2F35] font-medium">{implant.length}</span>
                    </div>
                    <div>
                      <span className="text-[#5C6773]">Torque:</span>
                      <span className="ml-2 text-[#2A2F35] font-medium">{implant.insertion_torque || 'N/A'} Ncm</span>
                    </div>
                    <div>
                      <span className="text-[#5C6773]">Connection:</span>
                      <span className="ml-2 text-[#2A2F35] font-medium">{implant.connection_type}</span>
                    </div>
                  </div>
                  {implant.notes && (
                    <p className="mt-3 text-sm text-[#5C6773] italic">{implant.notes}</p>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
};

export default PatientDetails;