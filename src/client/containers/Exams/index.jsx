import React from 'react';
import { Row, Col } from 'react-flexbox-grid';
import API from '../../api';
import CategoryButton from '../../components/Buttons/CategoryButton';
import StandardButton from '../../components/Buttons/StandardButton';

class Exams extends React.Component {

  constructor(props) {
    super(props);

    this.state = {
      school: props.params.school,
      course: props.params.course,
      exams: [],
    };
  }

  componentDidMount() {
    this.fetchExams();
  }

  fetchExams() {
    API.get(`/api/list/exams/${this.state.school}/${this.state.course}`, { sort: '-alphabetically' }).then((data) => {
      this.setState({ exams: data });
    });
  }

  render() {
    return (
      <div>
        <Row>
          <Col sm={4}>
            <CategoryButton href={`/${this.state.school}/${this.state.course}/random/10`}>10 Random</CategoryButton>
          </Col>
          <Col sm={4}>
            <CategoryButton href={`/${this.state.school}/${this.state.course}/random/30`}>30 Random</CategoryButton>
          </Col>
          <Col sm={4}>
            <CategoryButton href={`/${this.state.school}/${this.state.course}/hardest/10`}>10 Hardest</CategoryButton>
          </Col>
        </Row>

        <Row>
          { this.state.exams.map(exam => (
            <Col key={exam} xs={12} sm={6} md={4} lg={3}>
              <StandardButton href={`/${this.state.school}/${this.state.course}/${exam}`}>{ exam }</StandardButton>
            </Col>
          ))}
        </Row>
      </div>
    );
  }
}

export default Exams;