import {Box, styled} from "@mui/material";

export const StyledBox = styled(Box)(({theme}) => ({
    width: '100%',
    backgroundColor: theme.palette.background.paper,
    color: theme.palette.common.white,
    display: 'flex',
    justifyContent: 'space-around',
    flexDirection: 'row',
    padding: '10px',
    gap: '20px',
    paddingLeft: '10px',
    paddingRight: '10px',
}));