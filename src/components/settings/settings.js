<Box sx={{ display: "flex", justifyContent: "flex-end", gap: 2, mt: 3 }}>
  <Button
    variant="outlined"
    onClick={handleCancel}
    sx={{
      borderColor: "#D0D5DD",
      color: "#344054",
      "&:hover": {
        borderColor: "#B0B5BC",
        backgroundColor: "#f5f8fa",
      },
      minWidth: "120px",
      height: "40px",
      borderRadius: "8px",
      fontSize: "14px",
      fontWeight: 500,
    }}
  >
    Cancel
  </Button>
  <Button
    variant="contained"
    onClick={handleSave}
    sx={{
      backgroundColor: "#0487D9",
      color: "white",
      "&:hover": {
        backgroundColor: "#0373b3",
      },
      minWidth: "120px",
      height: "40px",
      borderRadius: "8px",
      fontSize: "14px",
      fontWeight: 500,
    }}
  >
    Save
  </Button>
</Box>;
