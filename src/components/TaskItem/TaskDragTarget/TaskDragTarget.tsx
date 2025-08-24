import "./TaskDragTarget.css";

type Props = {targetId : number,
        onDragEnter: (e: React.DragEvent, taskId: number) => void,
        onDragOver: (e: React.DragEvent, taskId: number) => void , 
        onDrop: (e: React.DragEvent, taskId: number) => void }  ;

export default function TaskDragTarget ({onDragEnter, onDragOver, onDrop, targetId}:Props){
    
    console.log("ondrag", onDragOver);
    return <div className="drag-target" 
            onDragEnter={(e) => onDragEnter(e, targetId)}
            onDragOver={(e) => {console.log(onDragOver); onDragOver(e, targetId)}}
            onDrop={(e) => onDrop(e, targetId)}>
        <hr/>
    </div>
}