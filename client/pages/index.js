import React, { useState, useEffect } from 'react'
import Head from 'next/head'
import { useRouter } from 'next/router'

import { publicFetch } from '../util/fetcher'

import Layout from '../components/layout'
import QuestionWrapper from '../components/question/question-wrapper'
import QuestionStats from '../components/question/question-stats'
import QuestionSummary from '../components/question/question-summary'
import PaginationWrapper from "../components/pagination/PaginationWrapper"
import PageTitle from '../components/page-title'
import ButtonGroup from '../components/button-group'
import { Spinner } from '../components/icons'
import { isEmpty } from "../util/helpers"

const HomePage = ({ query }) => {
  const router = useRouter()

  const [questions, setQuestions] = useState(null)
  const [pagination, setPagination] = useState(null)

  const [sortType, setSortType] = useState('Votes')

  useEffect(() => {
    const fetchQuestion = async () => {

      let endPoint = ""

      if (!isEmpty(router.query.page) && !isEmpty(router.query.limit)) {
        const { page, limit } = router.query
        endPoint = `/question?page=${page}&limit=${limit}`
      } else {
        endPoint = '/question?page=1&limit=20'
      }

      const { data } = await publicFetch.get(endPoint)
      setQuestions(data.results)
      setPagination(data.pagination)



    }

    const fetchQuestionByTag = async () => {
      const { data } = await publicFetch.get(`/questions/${router.query.tag}`)
      setQuestions(data)
    }

    if (router.query.tag) {
      fetchQuestionByTag()
    } else {
      fetchQuestion()
    }
  }, [router.query])

  const handleSorting = () => {
    switch (sortType) {
      case 'Votes':
        return (a, b) => b.score - a.score
      case 'Views':
        return (a, b) => b.views - a.views
      case 'Newest':
        return (a, b) => new Date(b.created) - new Date(a.created)
      case 'Oldest':
        return (a, b) => new Date(a.created) - new Date(b.created)
      default:
        break
    }
  }

  return (
    <Layout>
      <Head>
        <title>
          {router.query.tag ? router.query.tag : 'Questions'} - Clone of
          Stackoverflow
        </title>
      </Head>

      <PageTitle title={router.query.tag ? `Questions tagged [${router.query.tag}]` : 'All Questions'} button borderBottom={false} />

      <ButtonGroup
        borderBottom
        buttons={['Votes', 'Views', 'Newest', 'Oldest']}
        selected={sortType}
        setSelected={setSortType}
      />

      {!questions && (
        <div className="loading">
          <Spinner />
        </div>
      )}

      {questions
        ?.sort(handleSorting())
        .map(
          ({
            id,
            votes,
            answers,
            views,
            title,
            text,
            tags,
            author,
            created
          }) => (
            <QuestionWrapper key={id}>
              <QuestionStats
                voteCount={votes.length}
                answerCount={answers.length}
                view={views}
              />
              <QuestionSummary
                id={id}
                title={title}
                tags={tags}
                author={author}
                createdTime={created}
              >
                {text}
              </QuestionSummary>

            </QuestionWrapper >

          )
        )}

      {!isEmpty(pagination) && pagination.pages > 1 ? <PaginationWrapper pagination={pagination} /> : null}
    </Layout>
  )
}


export default HomePage
