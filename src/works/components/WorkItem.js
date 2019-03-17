import React, { memo } from 'react';
import { injectIntl } from 'react-intl';
import { Link } from 'react-router-dom';
import Lazyload from 'react-lazyload';

import styled from 'styled-components';
import WorkCover from './WorkCover';
import getImage from '../../common/Image/function';

const Card = styled.div`
  background-color: #fff;
  border-radius: 2px;
  box-shadow: 0 20px 20px rgba(0, 0, 0, 0.08);
  cursor: pointer;
  display: inline-block;
  margin-bottom: 65px;
  margin-right: 1.5%;
  margin-left: 1.5%;
  transform: translateY(10px);
  transition-property: all;
  transition-duration: 250ms;
  position: relative;
  width: 47%;
  white-space: normal;
  vertical-align: top;

  @media (max-width: 768px) {
    width: 100%;
  }

  &:hover {
    box-shadow: 0 40px 40px rgba(0, 0, 0, 0.16);
    transform: translate(0, -10px);
    transition-delay: 0s !important;
  }

  &:active {
    box-shadow: 0 40px 40px 5px rgba(0, 0, 0, 0.36);
    transform: translate(0, -5px);
    transition-delay: 0s !important;
  }
`;
const CardBody = styled.div`
  float: left;
  padding: 15px 25px 25px 20px;
  width: ${props => (props.size === 'small' ? '100%' : '70%')};

  @media (max-width: 1200px) {
    width: 60%;
  }

  @media (max-width: 990px) {
    width: 100%;
  }

  .card-body-heading {
    color: #6f6f6f;
    display: inline-block;
    font-size: 22px;
    margin-bottom: 15px;
    padding-left: 15%;

    @media (max-width: 990px) {
      padding-left: 0%;
      padding-right: 40%;
    }
  }

  .card-body-description {
    padding-left: 40px;
    ${props =>
      props.size === 'small'
        ? 'padding-left: 0;font-size: 0.9rem;color: #8a8e94;'
        : ''} @media (max-width: 990px) {
      padding-left: 0;
      font-size: 0.9rem;
      color: #8a8e94;
    }
  }
`;

const CoverWrapper = styled.span`
  ${props =>
    props.size !== 'small' ? 'height: 212px; width: 150px; float: left;' : ''}
`;

const getThumbSize = size => {
  if (size === 'small') {
    return { height: 350, width: 345 };
  } else {
    return { height: 220, width: 150 };
  }
};

function WorkItem({ work, truncate, size, statusTag, intl }) {
  const status = statusTag(work.status);
  const thumbSize = getThumbSize(size);
  const thumbnail =
    work.thumbnail !== ''
      ? getImage(
          `works/${work.uniqid}/${work.thumbnail}`,
          thumbSize.height,
          thumbSize.width,
          work.id
        )
      : '/static/images/default-cover.png';
  return (
    <Link to={'/work/' + work.stub}>
      <Card>
        <CoverWrapper size={size}>
          <Lazyload
            height={150}
            once
            debounce={false}
            placeholder={<WorkCover size={size} />}
          >
            <WorkCover
              cover={thumbnail}
              name={work.name}
              size={size}
              status={intl.formatMessage({
                id: status.name,
                defaultMessage: status.name
              })}
              statusTag={status.style}
            />
          </Lazyload>
        </CoverWrapper>

        <CardBody size={size}>
          {size !== 'small' && (
            <h2 className="card-body-heading">{work.name}</h2>
          )}
          <p className="card-body-description">{truncate(work)}</p>
        </CardBody>
      </Card>
    </Link>
  );
}

export default memo(injectIntl(WorkItem));
