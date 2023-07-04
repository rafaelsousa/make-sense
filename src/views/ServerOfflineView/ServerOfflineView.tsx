import {Alert, Box} from "@mui/material";
import React from "react";

const ServerOfflineView: React.FC<{  }> = props => {
    return (
        <>
            <Box
                sx={{
                    display: 'flex',
                    justifyContent: 'center',
                    alignItems: 'center',
                    height: '100vh'
                }}
            >
                <Alert severity="error">
                    Server is not responding. Please refresh the page or try again later.
                </Alert>
            </Box>
        </>
    );
};

export default ServerOfflineView;