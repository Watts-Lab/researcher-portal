'use client'

// const TitleWrapper = styled.div`
//     flex-grow: 0;
// `

// const ComponentContainer = styled.div`
//     background: #D9DDEA;
//     border: solid 1px;
//     padding: 10px;
//     height: 100vh;
//     display: flex;
//     flex-direction: column;
// `

// const ComponentWrapper = styled.div`
//     padding: 5px;
//     height: 100vh;
//     display: flex;
//     flex-direction: column;
//     align-items: stretch
// `

// const TimeWrapper = styled.div``

export function Stage({title, components, duration, width}) {
    return (
        <div style={{ width: width, minHeight: "100vh", display: "flex", flexDirection: "column", padding: "10px"}}>
            <h3>{title}</h3>
            <div style={{background: "#D9DDEA", border: "solid 1px", padding: "10px", height: "100vh", display: "flex", flexDirection: "column"}}>
                <div style={{padding: "5px", height: "100vh", display: "flex", flexDirection: "column", alignItems: "stretch"}}>
                    {components}
                    {/* this will actually be handled by the parser */}
                </div>
                <button> Add Component </button>
            </div>
            <div>
                {duration}
            </div>
        </div>
        
    )
}