import React from 'react';
import WysiwygIcon from '@mui/icons-material/Wysiwyg';
import Button from '@mui/material/Button';
import AddIcon from '@mui/icons-material/Add';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import DeleteIcon from '@mui/icons-material/Delete';
import { TextField } from '@mui/material';
import BorderTopIcon from '@mui/icons-material/BorderTop';
import BorderBottomIcon from '@mui/icons-material/BorderBottom';
const theme = createTheme({
    palette: {
        primary: {
            main: '#005FB7',
        },
        secondary: {
            main: '#262626',
        },
    },
});

type ControlPanelProps = {
    deleteItem : () => void,
    addRelation : () => void,
    changeFields : (amount : number) => void,
    addField : () => void
}

const ControlPanel: React.FC<ControlPanelProps> = ({deleteItem, addRelation, changeFields, addField}) => {
    return <>
        <ThemeProvider theme={theme}>
            <div className='panel-container'>
                <div className='panel'>
                    <div className='panel-item-group'>
                        <Button variant="outlined" color="secondary" onClick={addRelation}><AddIcon /> <WysiwygIcon /></Button>
                    </div>
                    <div className='panel-item-group'>
                        <Button variant="outlined" color="secondary" onClick={deleteItem}><DeleteIcon /></Button>
                    </div>
                    <BoxPanel />
                    <LinePanel />
                </div>
            </div>
        </ThemeProvider>
    </>
}

const BoxPanel: React.FC = () => {
    return <>
        <div className='panel-item-group'>
            <div className='panel-label'>
                Fields :
            </div>
            <div className='number-inp-container mr-r'>
                <TextField size='small' type={"number"} defaultValue={1} />
            </div>
            <div className='panel-label'>
                Add :
            </div>
            <div className='panel-btn-container'>
                <Button variant="outlined" color="secondary" className="panel-btn-container"><BorderTopIcon /></Button>
            </div>
            <div className='panel-btn-container'>
                <Button variant="outlined" color="secondary" className="panel-btn-container"><BorderBottomIcon /></Button>
            </div>
        </div>
    </>
}
const LinePanel: React.FC = () => {
    return <>
        <div className='panel-item-group'>
            <div className='panel-label'>
                Line
            </div>
        </div>
    </>
}

export default ControlPanel
