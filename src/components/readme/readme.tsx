// ChatComponent.tsx


const ReadmeComponent: React.FC = () => {



    return (
        <div  className="window bg-opacity-50" style={{ color:"black", maxWidth: "700px", background: "black", opacity: 0.9, top:"150px" ,right:"300px",fontSize:"1.3em" }}>
            <div className="title-bar">
                <div className="title-bar-text">README.txt</div>
                <div className="title-bar-controls">
                    <button aria-label="Minimize" />
                    <button aria-label="Maximize" />
                    <button aria-label="Close" />
                </div>
            </div>
            <div className="window-body" style={{ height: "200px", overflowY: "scroll",color:"white" }}>
                <p style={{ textAlign: "center" }}>--------------------------------</p>
                <p style={{ textAlign: "center" }}>Welcome to coneheadsquid game ! </p>
                <p style={{ textAlign: "center" }}>--------------------------------</p>
                <p style={{ textAlign: "left" }}># Connect your arconnect wallet</p>
                <p style={{ textAlign: "left" }}># use one ticket to collect floppy tokens!</p>
            </div>

        </div>
    );
};

export default ReadmeComponent;
