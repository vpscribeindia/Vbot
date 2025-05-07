import React, { useState, useEffect, useRef } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import io from "socket.io-client";
import { toast } from "react-toastify";
import moment from "moment";

import JobStatusList from "../components/user/JobStatusList";
import UploadSection from "../components/user/UploadSection";
import TranscriptDisplay from "../components/user/TranscriptDisplay";
import EditPatientDialog from "../components/user/EditPatientDialog";
import DeleteConfirmationDialog from "../components/user/DeleteConfirmationDialog";

import Header from "../components/admin/Header";

const API_MAIN_URL = import.meta.env.VITE_API_URL;
export const socket = io(API_MAIN_URL, { withCredentials: true });

const Dashboard = () => {
  const [selectedFiles, setSelectedFiles] = useState([]);
  const fileInputRef = useRef(null);
  const [uploadStatus, setUploadStatus] = useState("");
  const [PatientName, setPatientName] = useState("");
  const [jobStatuses, setJobStatuses] = useState([]);
  const [selectedJob, setSelectedJob] = useState(null);
  const [selectedTranscript, setSelectedTranscript] = useState(null);
  const [recording, setRecording] = useState(false);
  const mediaRecorderRef = useRef(null);
  const audioChunksRef = useRef([]);
  const [editedTranscript, setEditedTranscript] = useState({});
  const [changedFields, setChangedFields] = useState({});
  const [editingIndex, setEditingIndex] = useState(null);
  const [expandAll, setExpandAll] = useState(false);
  const [expandedIndexes, setExpandedIndexes] = useState(new Set());
  const [conversationTranscript, setConversationTranscript] = useState(null);
  const [templateName, setTemplateName] = useState("");
  const [templates, setTemplates] = useState([]);
  const [Templatevalue, setTemplatevalue] = useState("");
  const [remainingMinutes, setremainingMinutes] = useState("");
  const [openConfirmation, setOpenConfirmation] = useState(false);
  const [selectedFileId, setSelectedFileId] = useState(null);
  const [transcriptLoading, setTranscriptLoading] = useState(false);
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [selectedPatient, setSelectedPatient] = useState(null);
  const [editedName, setEditedName] = useState("");

  const navigate = useNavigate();

  // URLS
  const API_URL = `${API_MAIN_URL}/api/transcribe`;
  const PROGRESS_API_URL = `${API_MAIN_URL}/api/progress`;
  const FORMAT_API_URL = `${API_MAIN_URL}/api/reformatthis`;
  const GET_ALL_FILES_URL = `${API_MAIN_URL}/api/fetchall`;
  const DELETE_FILE = `${API_MAIN_URL}/api/deletefile`;
  const UPDATE_TRANSCRIPT_URL = `${API_MAIN_URL}/api/updatetranscript`;
  const GET_ALL_TEMPLATE_URL = `${API_MAIN_URL}/api/fetchalltemplates`;
  const UPDATE_PATIENT_NAME_URL = `${API_MAIN_URL}/api/updatepatientname`;

  const handleEditClick = (job) => {
    setSelectedPatient(job);
    setEditedName(job.PatientName || "");
    setEditModalOpen(true);
  };

  const handleChange = (event) => {
    const newValue = event.target.value;
    setTemplatevalue(newValue);
  };

  const handleChangefetched = async (event) => {
    const newTemplateName = event.target.value;
    try {
      await axios.post(
        FORMAT_API_URL,
        { fileId: selectedJob, templateName: newTemplateName },
        { withCredentials: true }
      );
      handleJobClick(selectedJob);
    } catch (error) {
      console.error(error);
    }
  };

  const handleOpen = (fileId) => {
    setSelectedFileId(fileId);
    setOpenConfirmation(true);
  };

  const handleClose = () => {
    setOpenConfirmation(false);
    setSelectedFileId(null);
  };

  const confirmDelete = () => {
    if (selectedFileId) {
      handleDelete(selectedFileId);
    }
    handleClose();
  };

  const handleUpdatePatientName = async () => {
    try {
      await axios.post(
        UPDATE_PATIENT_NAME_URL,
        { fileId: selectedPatient.fileId, patientName: editedName },
        { withCredentials: true }
      );
      setJobStatuses((prev) =>
        prev.map((j) =>
          j.fileId === selectedPatient.fileId
            ? { ...j, PatientName: editedName }
            : j
        )
      );
      setEditModalOpen(false);
    } catch (error) {
      console.error("Error updating name:", error);
    }
  };

  const toggleExpandAll = () => {
    setExpandAll((prevExpandAll) => {
      const newExpandAll = !prevExpandAll;
      const indexesToSet = newExpandAll
        ? new Set(uniqueSections.map((s) => s.index))
        : new Set();
      setExpandedIndexes(indexesToSet);
      return newExpandAll;
    });
  };
  

  const toggleSingleExpand = (index) => {
    setExpandedIndexes((prev) => {
      const newSet = new Set(prev);
      newSet.has(index) ? newSet.delete(index) : newSet.add(index);
      return newSet;
    });
  };


  const handleTranscriptChange = (e, sectionIndex) => {
    const { name, value } = e.target;
    const key = `${sectionIndex}_${name}`;
    setEditedTranscript((prev) => ({
      ...prev,
      [key]: value,
    }));
    setChangedFields((prev) => ({
      ...prev,
      [key]: value, // Track only changed fields
    }));
  };

  
  
  const handleUpdateTranscript = async () => {
    if (!selectedJob || Object.keys(changedFields).length === 0) return;
    try {
      await axios.put(
        UPDATE_TRANSCRIPT_URL,
        { fileId: selectedJob, transcript: changedFields },
        { withCredentials: true }
      );
      setChangedFields({});
    } catch (error) {
      console.error("Error updating transcript:", error);
    }
  };

  useEffect(() => {
    const fetchFiles = async () => {
      try {
        const { data } = await axios.get(GET_ALL_FILES_URL, { withCredentials: true });
        const response = await axios.get(GET_ALL_TEMPLATE_URL, { withCredentials: true });
        const response1 = await axios.get(`${API_MAIN_URL}/api/getBillingByMinutes`, { withCredentials: true });
        const minutes = convertTime(response1.data.usage_limit);
        setremainingMinutes(parseInt(response1.data.usage_limit) === 99999 ? "unlimited" : minutes);
        setJobStatuses(data);
        const list = response.data.templateNames || [];
        setTemplates(list);
        if (list.length > 2) {
          const defaultValue = list[2];
          setTemplatevalue(defaultValue);
        }
      } catch (error) {
        console.error("Error fetching files:", error);
      }
    };
    fetchFiles();

    const handleProgress = (data) => {
      setJobStatuses((prevJobs) => {
        const index = prevJobs.findIndex((job) => job.fileId === data.fileId);
        if (index !== -1) {
          const updatedJobs = [...prevJobs];
          updatedJobs[index] = { ...updatedJobs[index], ...data };
          return updatedJobs;
        }
        return [data, ...prevJobs];
      });
    };

    const handleProgresstranscript = (data) => {
      setTranscriptLoading(true);
      if (data.status === "completed" || data.status === "failed") {
        setTranscriptLoading(false);
        handleJobClick(data.fileId);
      }
    };

    socket.on("progress", handleProgress);
    socket.on("progress_transcript", handleProgresstranscript);

    return () => {
      socket.off("progress", handleProgress);
      socket.off("progress_transcript", handleProgresstranscript);
    };
  }, []);

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) setSelectedFiles([file]);
    setUploadStatus("");
  };

  const handleUpload = async () => {
    if (!PatientName.trim()) return toast.error("Patient name is required");
    const file = fileInputRef.current?.files[0];
    if (!file) return toast.error("Please select a file.");
    const allowedExtensions = ["wav", "mp3", "m4a"];
    const ext = file.name.split(".").pop().toLowerCase();
    if (!allowedExtensions.includes(ext)) return toast.error("Only .wav, .mp3, .m4a allowed.");
    if (selectedFiles.length === 0 || !PatientName || !Templatevalue) return;
    setUploadStatus("Uploading and processing...");
    if (fileInputRef.current) fileInputRef.current.value = null;
    const formData = new FormData();
    formData.append("audioFiles", selectedFiles[0]);
    formData.append("patientName", PatientName);
    formData.append("templateName", Templatevalue);
    try {
      const { data } = await axios.post(API_URL, formData, {
        headers: { "Content-Type": "multipart/form-data" },
        withCredentials: true
      });
      setJobStatuses((prev) => [{ fileId: data.fileId, status: "Queued" }, ...prev]);
      setremainingMinutes(parseInt(data.usage_limit) === 99999 ? "unlimited" : convertTime(data.usage_limit));
      setUploadStatus("Upload successful!");
      setSelectedFiles([]);
      setPatientName("");
    } catch (error) {
      console.error("Error uploading files:", error);
      setUploadStatus("Upload failed. Please try again.");
    }
  };

  const handleJobClick = async (fileId) => {
    setSelectedJob(fileId);
    setSelectedTranscript(null);
    setUploadStatus("");
    setEditedTranscript({});
    try {
      const { data } = await axios.get(`${PROGRESS_API_URL}/${fileId}`, { withCredentials: true });
      setSelectedTranscript(data.transcript || "No transcript available.");
      setConversationTranscript(data.conversationTranscript || "No conversation transcript available.");
      setTemplateName(data.templateName || "SOAP General Notes");
    } catch (error) {
      console.error("Error fetching transcript:", error);
      setSelectedTranscript("Failed to fetch transcript.");
    }
  };

  const handleStartRecording = async () => {
    if (!PatientName.trim()) return toast.error("Patient name is required");
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      mediaRecorderRef.current = new MediaRecorder(stream);
      audioChunksRef.current = [];
      mediaRecorderRef.current.ondataavailable = (event) => {
        if (event.data.size > 0) audioChunksRef.current.push(event.data);
      };
      mediaRecorderRef.current.start();
      setRecording(true);
    } catch (error) {
      console.error("Error accessing microphone:", error);
    }
  };

  const getAccurateDuration = (blob) => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = async (event) => {
        const arrayBuffer = event.target.result;
        const audioContext = new (window.OfflineAudioContext || window.webkitOfflineAudioContext)(1, 2, 44100);
        try {
          const audioBuffer = await audioContext.decodeAudioData(arrayBuffer);
          resolve(audioBuffer.duration);
        } catch (err) {
          reject(err);
        }
      };
      reader.onerror = () => reject("FileReader error");
      reader.readAsArrayBuffer(blob);
    });
  };

  const handleStopRecording = async () => {
    if (!PatientName || !Templatevalue) return;
    if (!mediaRecorderRef.current) return;
    mediaRecorderRef.current.stop();
    mediaRecorderRef.current.onstop = async () => {
      if (audioChunksRef.current.length === 0) return;
      const audioBlob = new Blob(audioChunksRef.current, { type: "audio/webm" });
      const duration = await getAccurateDuration(audioBlob);
      const fileName = `recording_${Date.now()}.webm`;
      const formData = new FormData();
      formData.append("audioFiles", audioBlob, fileName);
      formData.append("patientName", PatientName);
      formData.append("templateName", Templatevalue);
      formData.append("audioduration", duration);
      setRecording(false);
      audioChunksRef.current = [];
      try {
        const { data } = await axios.post(API_URL, formData, { withCredentials: true });
        setremainingMinutes(parseInt(data.usage_limit) === 99999 ? "unlimited" : convertTime(data.usage_limit));
        setJobStatuses((prev) => [{ fileId: data.fileId, status: "Queued" }, ...prev]);
      } catch (error) {
        console.error("Error uploading recording:", error);
      }
    };
  };

  const handleDelete = async (fileId) => {
    try {
      await axios.delete(`${DELETE_FILE}/${fileId}`, { withCredentials: true });
      setJobStatuses((prev) => prev.filter((job) => job.fileId !== fileId));
      setSelectedTranscript(null);
      setConversationTranscript(null);
      setTemplateName(null);
    } catch (error) {
      console.error("Error deleting file:", error);
    }
  };

  const convertTime = (seconds) => {
    if (seconds < 60) return `${seconds} sec`;
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const remainingSeconds = Math.round(seconds % 60);
    let result = [];
    if (hours > 0) result.push(`${hours} hr`);
    if (minutes > 0) result.push(`${minutes} min`);
    if (remainingSeconds > 0) result.push(`${remainingSeconds} sec`);
    return result.join(" ");
  };

  const parseJSONTranscript = (flattenedTranscript) => {
    if (!flattenedTranscript || typeof flattenedTranscript !== "object") return [];
    const result = [];
    Object.keys(flattenedTranscript).forEach((key) => {
      const match = key.match(/^(\d+)_heading$/);
      if (match) {
        const index = Number(match[1]);
        const heading = flattenedTranscript[`${index}_heading`]?.trim();
        const text = flattenedTranscript[`${index}_text`]?.trim() || "";
        result.push({ index, heading, text });
      }
    });
    return result.sort((a, b) => a.index - b.index);
  };

  const formatTranscript = (parsedConversationTranscript) => {
    const formattedStrings = [];
    parsedConversationTranscript.forEach((speakerObj) => {
      Object.entries(speakerObj).forEach(([speaker, sentences]) => {
        sentences.forEach(({ text, startTime, endTime }) => {
          formattedStrings.push(`${speaker} (${startTime}-${endTime}) => ${text}`);
        });
      });
    });
    return formattedStrings;
  };

  const safeJSONParse = (input) => {
    try {
      return typeof input === "string" ? JSON.parse(input) : input;
    } catch (e) {
      console.error("JSON parse failed:", e);
      return null;
    }
  };

  const parsedTranscript = safeJSONParse(selectedTranscript);
  const uniqueSections = parsedTranscript
    ? Array.from(new Map(parseJSONTranscript(parsedTranscript).map((item) => [item.index, item])).values())
    : [];

  return (
    <div className="flex flex-col lg:flex-row gap-6 h-full">
      <JobStatusList
        remainingMinutes={remainingMinutes}
        jobStatuses={jobStatuses}
        selectedJob={selectedJob}
        handleJobClick={handleJobClick}
        handleOpen={handleOpen}
        handleEditClick={handleEditClick}
        API_MAIN_URL={API_MAIN_URL}
        convertTime={convertTime}
      />

      <div className="w-full bg-white shadow-lg max-h-screen overflow-y-auto">
        <Header variant="user" />
        <UploadSection
          PatientName={PatientName}
          setPatientName={setPatientName}
          templates={templates}
          Templatevalue={Templatevalue}
          handleChange={handleChange}
          fileInputRef={fileInputRef}
          handleFileChange={handleFileChange}
          handleUpload={handleUpload}
          recording={recording}
          handleStartRecording={handleStartRecording}
          handleStopRecording={handleStopRecording}
          uploadStatus={uploadStatus}
        />

        <TranscriptDisplay
          transcriptLoading={transcriptLoading}
          selectedTranscript={selectedTranscript}
          expandAll={expandAll}
          toggleExpandAll={toggleExpandAll}
          expandedIndexes={expandedIndexes}
          toggleSingleExpand={toggleSingleExpand}
          templateName={templateName}
          handleChangefetched={handleChangefetched}
          templates={templates}
          uniqueSections={uniqueSections}
          editingIndex={editingIndex}
          editedTranscript={editedTranscript}
          handleTranscriptChange={handleTranscriptChange}
          handleUpdateTranscript={handleUpdateTranscript}
          conversationTranscript={conversationTranscript}
          formatTranscript={formatTranscript}
          safeJSONParse={safeJSONParse}
          setEditingIndex={setEditingIndex}
        />
      </div>

      <EditPatientDialog
        editModalOpen={editModalOpen}
        setEditModalOpen={setEditModalOpen}
        editedName={editedName}
        setEditedName={setEditedName}
        handleUpdatePatientName={handleUpdatePatientName}
      />

      <DeleteConfirmationDialog
        openConfirmation={openConfirmation}
        handleClose={handleClose}
        confirmDelete={confirmDelete}
      />
    </div>
  );
};

export default Dashboard;
