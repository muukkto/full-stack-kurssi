const Course = ({course}) => {  
    const Header = (props) => {
      return (
      <div>
        <h1>{props.course}</h1>
      </div>
      )
    }

    const Content = (props) => {
      const Part = (props) => {
        return (
          <>{props.part.name} {props.part.exercises}</>
        )
      }

      const Total = (props) => {

        const total = props.parts.reduce( (s, p) => s + p.exercises, 0)

        return (
          <p><b>Total of {total} exercises</b></p>
        )
      }

      return (
        <div>
        {props.parts.map(part => <p key={part.id}><Part part={part} /></p>)}
        <Total parts={props.parts} />
        </div>
      )
    }


    return (
      <>
      <Header course={course.name} />
      <Content parts={course.parts} />
      </>
    )
}

export default Course