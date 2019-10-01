import React from 'react'
import { connect } from 'react-redux'
import PropTypes from 'prop-types'
import { Row, Col } from 'react-flexbox-grid'
import { getQuestions, sendReport } from '../../api'
import LoadingSpinner from '../../components/LoadingSpinner'
import { getLocalTime, percentageToGrade } from '../../utils'
import ProgressBar from '../../components/ProgressBar'
import {
  clear, giveAnswer, loadQuestions, statsReceived,
} from '../../actions/QuestionActions'
import { startLoading, stopLoading } from '../../actions/LoadingActions'
import Question from './Question'
import Explanation from './Explanation'
import Alternative from '../../components/Buttons/Alternative'
import './Questions.css'

class Questions extends React.Component {
  constructor(props) {
    super(props)

    this.state = {
      finishedReturnedTrue: false, // Prevents multiples of the same report being sent to server.
      // String representing the doc fetch mode. 'random' if Random X is clicked, etc.
      mode: 'exam',
    }

    if (!props.params.exam && !props.params.mode) {
      this.state.mode = 'all'
    }
    else if (props.params.mode) {
      this.state.mode = props.params.mode
    }

    // Clear quiz history in case this is not the first quiz
    this.props.clear()
  }

  componentDidMount() {
    const {
      school, course, exam, number,
    } = this.props.params

    this.props.startLoading()

    getQuestions(school, course, {
      mode: this.state.mode,
      exam,
      limit: number,
    }).then((questions) => {
      this.props.stopLoading()
      this.props.loadQuestions(questions)
    })
  }

  // Get the (current) ratio of correct answers per total number of answered questions.
  percentage() {
    if (this.props.history.length === 0) return 0
    const numCorrect = this.props.history.map((q) => q.wasCorrect).filter(Boolean).length
    return Math.round((10000 * numCorrect) / this.props.history.length) / 100
  }

  // Returns the class (color, mostly) of the option button
  // decided by if it's the right answer or not.
  buttonClass(option) {
    if (!this.props.answerGiven) {
      const mobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent)
      return mobile ? 'alternativeMobile' : 'alternative'
    }

    const previousQuestion = this.props.questions[this.props.history.length - 1]

    // Check if the option the button represents is one of the correct answers.
    if (previousQuestion.answers.indexOf(previousQuestion.options.indexOf(option)) >= 0) {
      return 'correctAnswer'
    }

    return 'wrongAnswer'
  }

  answer(givenAnswer) {
    if (this.finished()) {
      this.props.router.push(`${this.props.location.pathname}/results`)
    }
    else {
      this.props.answer(givenAnswer)
    }
  }

  // Checks if exam is finished. Reports stats to server if true.
  // Fetches aggregated stats from server.
  finished() {
    if (this.props.history.length < this.props.questions.length || this.props.questions.length === 0) {
      return false
    }

    if (this.state.finishedReturnedTrue) {
      return true
    }

    this.setState({
      finishedReturnedTrue: true,
    })

    const report = {
      exam: {
        school: this.props.params.school,
        course: this.props.params.course,
        name: (this.state.mode !== 'exam') ? this.state.mode : this.props.params.exam,
      },
      createdAt: getLocalTime(),
      history: this.props.history,
      score: this.props.history.filter((q) => q.wasCorrect).length,
      numQuestions: this.props.questions.length,
      percentage: this.percentage(),
      grade: percentageToGrade(this.percentage()),
    }

    sendReport(report).then((stats) => {
      this.props.statsReceived({ ...stats, numQuestions: report.numQuestions })
    })

    return true
  }

  render() {
    const question = this.props.currentQuestion

    if (this.props.loading) {
      return <LoadingSpinner />
    }

    return (
      <div>
        <ProgressBar history={this.props.history.map((q) => q.wasCorrect)} questions={this.props.questions} />

        { this.props.questions.length ? (
          <Row className="questionRow">
            <Col xs={12}>
              <Question text={question.question} />
            </Col>
          </Row>
        ) : null }

        { this.props.questions.length ? (
          <Row className="alternativesRow">
            <Col xs={12} className="alternativesCol">
              { question && question.options.map((option) => (
                <Alternative
                  key={option}
                  text={option}
                  type={this.buttonClass(option)}
                  onClick={() => this.answer(option)}
                />
              ))}
              { this.props.answerGiven ? (
                <div>
                  <Explanation text={question.explanation} />
                  <b role="alert" className="continueTip">
                    Click any answer to continue
                  </b>
                </div>
              ) : null }
            </Col>
          </Row>
        ) : null }
      </div>
    )
  }
}

Questions.propTypes = {
  answer: PropTypes.func,
  answerGiven: PropTypes.bool,
  clear: PropTypes.func,
  loading: PropTypes.bool,
  loadQuestions: PropTypes.func,
  statsReceived: PropTypes.func,
  startLoading: PropTypes.func,
  stopLoading: PropTypes.func,
  history: PropTypes.arrayOf(PropTypes.shape({
    questionId: PropTypes.string,
    givenAnswer: PropTypes.string,
    wasCorrect: PropTypes.bool,
  })),
  currentQuestion: PropTypes.shape({
    answers: PropTypes.arrayOf(PropTypes.number),
    options: PropTypes.arrayOf(PropTypes.string),
    question: PropTypes.string,
  }),
  questions: PropTypes.arrayOf(PropTypes.shape({
    answers: PropTypes.arrayOf(PropTypes.number),
    options: PropTypes.arrayOf(PropTypes.string),
    question: PropTypes.string,
  })),
}

const mapStateToProps = (state) => ({
  answerGiven: state.questions.answerGiven,
  currentQuestion: state.questions.currentQuestion,
  history: state.questions.history,
  questions: state.questions.questions,
  loading: state.loading.loading,
})

const mapDispatchToProps = (dispatch) => ({
  answer: (option) => {
    dispatch(giveAnswer(option))
  },
  clear: () => {
    dispatch(clear())
  },
  loadQuestions: (questions) => {
    dispatch(loadQuestions(questions))
  },
  statsReceived: (stats) => {
    dispatch(statsReceived(stats))
  },
  startLoading: () => {
    dispatch(startLoading())
  },
  stopLoading: () => {
    dispatch(stopLoading())
  },
})

export default connect(mapStateToProps, mapDispatchToProps)(Questions)
