import AddIcon from "@mui/icons-material/Add";
import {
  Box,
  Button,
  CircularProgress,
  Grid2,
  Paper,
  TextField,
  Typography,
} from "@mui/material";
import { useFormik } from "formik";
import React from "react";
import { validationSchema } from "./validationSchema";

const AddPairForm = ({ gun, onSubmit, isLoading }) => {
  const formik = useFormik({
    initialValues: {
      email_address: "",
      public_key: "",
    },
    validationSchema,
    onSubmit: async (values, { resetForm }) => {
      try {
        const pairId = `${Date.now()}`;
        const pairData = {
          ...values,
          timestamp: Date.now(),
        };

        await new Promise((resolve, reject) => {
          gun
            .get("pairs")
            .get(pairId)
            .put(pairData, (ack) => {
              if (ack.err) reject(ack.err);
              else resolve();
            });
        });

        onSubmit?.(pairData);
        resetForm();
      } catch (error) {
        console.error("Failed to add pair:", error);
      }
    },
  });

  const handleClear = () => {
    formik.resetForm();
  };

  return (
    <Box
      sx={{ p: 4, minHeight: "100vh", backgroundColor: "rgba(0, 0, 0, 0.7)" }}
    >
      <Paper
        sx={{
          backgroundColor: "rgba(38, 38, 38, 0.9)",
          backdropFilter: "blur(10px)",
          borderRadius: 3,
          border: "1px solid rgba(255, 255, 255, 0.1)",
          overflow: "hidden",
          boxShadow: "0 4px 20px rgba(0, 0, 0, 0.25)",
        }}
      >
        {/* Header */}
        <Box
          sx={{
            p: 3,
            borderBottom: "1px solid rgba(255, 255, 255, 0.1)",
            background:
              "linear-gradient(135deg, rgba(88, 86, 214, 0.15) 0%, rgba(155, 106, 222, 0.15) 100%)",
          }}
        >
          <Typography
            variant="h5"
            sx={{
              color: "#fff",
              display: "flex",
              alignItems: "center",
              gap: 1,
              fontWeight: 600,
            }}
          >
            <AddIcon
              sx={{
                color: "#90caf9",
              }}
            />
            Add New Key Pair
          </Typography>
          <Typography
            variant="body2"
            sx={{ color: "rgba(255, 255, 255, 0.7)", mt: 1 }}
          >
            Securely store and manage public keys for encrypted communication
          </Typography>
        </Box>

        <Box sx={{ p: 3 }}>
          <form onSubmit={formik.handleSubmit}>
            <Grid2 container spacing={2}>
              <Grid2 size={{ xs: 12 }}>
                <TextField
                  fullWidth
                  name="email_address"
                  label="Email Address *"
                  value={formik.values.email_address}
                  onChange={formik.handleChange}
                  error={
                    formik.touched.email_address &&
                    Boolean(formik.errors.email_address)
                  }
                  helperText={
                    formik.touched.email_address && formik.errors.email_address
                  }
                  disabled={isLoading}
                  sx={{
                    "& .MuiOutlinedInput-root": {
                      backgroundColor: "rgba(0, 0, 0, 0.2)",
                      borderRadius: "8px",
                      "& fieldset": {
                        borderColor: "rgba(255, 255, 255, 0.1)",
                      },
                      "&:hover fieldset": {
                        borderColor: "rgba(255, 255, 255, 0.2)",
                      },
                      "&.Mui-focused fieldset": {
                        borderColor: "rgba(138, 116, 249, 0.6)",
                      },
                    },
                    "& .MuiOutlinedInput-input": {
                      color: "#fff",
                    },
                    "& .MuiInputLabel-root": {
                      color: "rgba(255, 255, 255, 0.7)",
                    },
                    "& .MuiInputLabel-root.Mui-focused": {
                      color: "rgba(138, 116, 249, 0.8)",
                    },
                    "& .MuiFormHelperText-root": {
                      color: "#f44336",
                    },
                  }}
                />
              </Grid2>

              <Grid2 size={{ xs: 12 }}>
                <TextField
                  fullWidth
                  name="public_key"
                  label="Public Key *"
                  multiline
                  rows={4}
                  value={formik.values.public_key}
                  onChange={formik.handleChange}
                  error={
                    formik.touched.public_key &&
                    Boolean(formik.errors.public_key)
                  }
                  helperText={
                    formik.touched.public_key && formik.errors.public_key
                  }
                  disabled={isLoading}
                  sx={{
                    "& .MuiOutlinedInput-root": {
                      backgroundColor: "rgba(0, 0, 0, 0.2)",
                      borderRadius: "8px",
                      "& fieldset": {
                        borderColor: "rgba(255, 255, 255, 0.1)",
                      },
                      "&:hover fieldset": {
                        borderColor: "rgba(255, 255, 255, 0.2)",
                      },
                      "&.Mui-focused fieldset": {
                        borderColor: "rgba(138, 116, 249, 0.6)",
                      },
                    },
                    "& .MuiOutlinedInput-input": {
                      color: "#fff",
                    },
                    "& .MuiInputLabel-root": {
                      color: "rgba(255, 255, 255, 0.7)",
                    },
                    "& .MuiInputLabel-root.Mui-focused": {
                      color: "rgba(138, 116, 249, 0.8)",
                    },
                    "& .MuiFormHelperText-root": {
                      color: "#f44336",
                    },
                  }}
                />
              </Grid2>

              <Grid2 size={{ xs: 12 }}>
                <Box
                  sx={{
                    display: "flex",
                    gap: 2,
                    justifyContent: "flex-start",
                    mt: 2,
                  }}
                >
                  <Button
                    type="submit"
                    variant="contained"
                    disabled={isLoading}
                    startIcon={
                      isLoading ? (
                        <CircularProgress size={20} color="inherit" />
                      ) : (
                        <AddIcon />
                      )
                    }
                    sx={{
                      background:
                        "linear-gradient(135deg, #5856d6 0%, #9b6ade 100%)",
                      color: "#fff",
                      padding: "10px 30px",
                      "&:hover": {
                        background:
                          "linear-gradient(135deg, #4338ca 0%, #7c3aed 100%)",
                      },
                    }}
                  >
                    {isLoading ? "Adding..." : "Add Pair"}
                  </Button>

                  <Button
                    type="button"
                    variant="outlined"
                    onClick={handleClear}
                    disabled={isLoading}
                    sx={{
                      borderColor: "rgba(255, 255, 255, 0.2)",
                      color: "#fff",
                      padding: "10px 30px",
                      "&:hover": {
                        borderColor: "rgba(255, 255, 255, 0.3)",
                        backgroundColor: "rgba(255, 255, 255, 0.05)",
                      },
                    }}
                  >
                    Clear
                  </Button>
                </Box>
              </Grid2>
            </Grid2>
          </form>
        </Box>
      </Paper>
    </Box>
  );
};

export default AddPairForm;
