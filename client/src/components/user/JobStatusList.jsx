import React from "react";
import { motion } from "framer-motion";
import {
  Box,
  Button,
  Card,
  CardActionArea,
  CardActions,
  CardContent,
} from "@mui/material";
import { DeleteForever, Edit, Done, AccessTime } from "@mui/icons-material";
import ReactAudioPlayer from "react-audio-player";

/**
 * JobStatusList Component
 *
 * Props:
 * - remainingMinutes: string
 * - jobStatuses: array of jobs [{ fileId, status, PatientName, fileName, duration }]
 * - selectedJob: fileId of selected job
 * - handleJobClick: function (fileId) => void
 * - handleOpen: function (fileId) => void (opens delete confirmation)
 * - handleEditClick: function (job) => void (opens edit dialog)
 * - API_MAIN_URL: string (base URL for audio file source)
 * - convertTime: function (seconds) => string
 */
const JobStatusList = ({
  remainingMinutes,
  jobStatuses,
  selectedJob,
  handleJobClick,
  handleOpen,
  handleEditClick,
  API_MAIN_URL,
  convertTime,
}) => {
  return (
    <div className="lg:w-96 w-77 px-4 pb-4 max-h-screen overflow-y-auto bg-white shadow-lg rounded-lg">
      {/* Remaining Time */}

      {/* Title */}
      <Box
        sx={{ typography: "h6", gutterBottom: true }}
        className="sticky top-0 bg-white pb-5 z-50"
      >
        Queued Files
        <Box sx={{fontSize:14}}> Remaining Time: {remainingMinutes || "0"}</Box>
      </Box>

      <div className="space-y-2">
        {jobStatuses.length > 0 ? (
          jobStatuses.map((job) => (
            <motion.div
              key={job.fileId}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4 }}
              className={`p-1 relative rounded-lg shadow-lg transition-all duration-300 group 
                ${
                  selectedJob === job.fileId ? "bg-blue-500" : "bg-gray-200"
                } hover:shadow-lg`}
            >
              <Card className="p-2 shadow-none">
                {job.status === "completed" ? (
                  <>
                    <CardActionArea
                      onClick={() => handleJobClick(job.fileId)}
                      className="p-3 flex flex-col gap-2"
                    >
                      <Box sx={{ typography: "h7", gutterBottom: true }}>
                        Patient Name:
                      </Box>
                      <Box sx={{ typography: "h6", gutterBottom: true }}>
                        {job.PatientName}
                      </Box>

                      <div className="flex items-center gap-3">
                        <ReactAudioPlayer
                          src={`${API_MAIN_URL}/${job.fileName}`}
                          controls
                        />
                      </div>

                      <Box sx={{ typography: "body1" }} className="font-medium">
                        <AccessTime /> {convertTime(job.duration)}
                      </Box>

                      <Box
                        sx={{ typography: "body1" }}
                        className="text-gray-600"
                      >
                        <Done className="me-2 text-green-600" /> {job.status}
                      </Box>
                    </CardActionArea>

                    <CardActions className="opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex justify-end px-4 pb-3">
                      <Button
                        onClick={() => handleOpen(job.fileId)}
                        color="error"
                        variant="outlined"
                        className="rounded-lg"
                      >
                        <DeleteForever />
                      </Button>
                      <Button
                        onClick={() => handleEditClick(job)}
                        color="primary"
                        variant="outlined"
                        className="rounded-lg mr-2"
                      >
                        <Edit />
                      </Button>
                    </CardActions>
                  </>
                ) : (
                  <CardContent className="flex items-center gap-3 p-3">
                    <span className="animate-spin border-4 border-gray-300 border-t-blue-500 rounded-full w-10 h-10"></span>
                    <Box sx={{ typography: "body2" }} className="text-gray-600">
                      {job.status}
                    </Box>
                  </CardContent>
                )}
              </Card>
            </motion.div>
          ))
        ) : (
          <Box
            sx={{ typography: "body2" }}
            className="text-gray-500 text-center"
          >
            No queued files yet.
          </Box>
        )}
      </div>
    </div>
  );
};

export default JobStatusList;
