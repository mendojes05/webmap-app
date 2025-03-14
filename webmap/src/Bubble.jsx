import { Handle, Position} from '@xyflow/react';
 

const Bubble = ({ data }) => {
  // Base font size and minimum font size
  const baseFontSize = 16;
  const minFontSize = 10;
  
  // Adjust font size dynamically based on the node's width
  const calculateFontSize = (text, width) => {
    const scaleFactor = 3; // Adjust as needed
    const newSize = Math.max(minFontSize, width / (text.length * scaleFactor));
    return newSize;
  };

  const fontSize = calculateFontSize(data.label, 100); // Assuming node width is 100

  return (
    <div
      style={{
        width: `${data.size + 60}px`,
        height: `${data.size}px`,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        border: "1px solid black",
        borderRadius: "5px",
        background: "#fff",
        textAlign: "center",
        overflow: "hidden",
        fontSize: `${fontSize}px`,
      }}
    >
      <Handle type="target" position="top" style={{ background: "red" }} />
      <div>{data.label}</div>
      <Handle type="source" position="bottom" style={{ background: "blue" }} />
    </div>
  );
};

export default Bubble;
