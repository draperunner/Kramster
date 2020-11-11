import React from 'react'
import { Row, Col } from 'react-flexbox-grid'
import { useExams } from '../../hooks'
import CategoryButton from '../../components/Buttons/CategoryButton'
import StandardButton from '../../components/Buttons/StandardButton'
import { LoadingSpinner } from '../../components'
import styles from './Exams.css'

interface Props {
  params: {
    school: string
    course: string
  }
}

function Exams(props: Props): JSX.Element {
  const { school, course } = props.params
  const exams = useExams(school, course)

  if (!exams?.length) {
    return <LoadingSpinner />
  }

  return (
    <div className={styles.wrapper}>
      <Row className={styles.categoriesRow}>
        <Col xs={4} className={styles.col}>
          <CategoryButton href={`/${school}/${course}/random/10`}>
            10 Random
          </CategoryButton>
        </Col>
        <Col xs={4} className={styles.col}>
          <CategoryButton href={`/${school}/${course}/random/30`}>
            30 Random
          </CategoryButton>
        </Col>
        <Col xs={4} className={styles.col}>
          <CategoryButton href={`/${school}/${course}/hardest/10`}>
            10 Hardest
          </CategoryButton>
        </Col>
      </Row>

      <Row className={styles.examsRow}>
        {exams.map(({ id, name }) => (
          <Col key={id} xs={6} md={4} lg={3} className={styles.col}>
            <StandardButton href={`/${school}/${course}/${name}`}>
              {name}
            </StandardButton>
          </Col>
        ))}
      </Row>
    </div>
  )
}

export default Exams