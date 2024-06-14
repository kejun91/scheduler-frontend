import "./TimeInput.css"

interface TimeInputProps{
    value:string;
    onChange: ({detail}:any) => any;
}

export default function TimeInput({value, onChange}:TimeInputProps){
    return (
        <input type="time" className="Custom-Input" value={value} onChange={(event) => onChange({"detail":event.target})}></input>
    );
};