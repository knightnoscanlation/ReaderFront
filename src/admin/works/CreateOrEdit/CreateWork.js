import React, { useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { useMutation } from '@apollo/react-hooks';
import { useHistory } from 'react-router-dom';
import { useIntl } from 'react-intl';

import WorkForm from './Form';
import CreatePersonModal from '../CreatePersonModal';
import { Card, ButtonLink, Container } from 'common/ui';
import { MetaTagCreate } from '../ACPWorksMetaTags';
import { FETCH_WORKS } from '../query';
import { CREATE_WORK } from '../mutation';

export const postEmpty = {
  id: 0,
  name: '',
  stub: '',
  type: '',
  hidden: false,
  demographicId: 0,
  status: 0,
  statusReason: '',
  adult: false,
  visits: 0,
  thumbnail: '',
  people_works: [],
  works_descriptions: [],
  works_genres: []
};

function CreateWork() {
  const [isCreatePersonModal, toggleCreatePersonModal] = useState(false);
  const history = useHistory();
  const { formatMessage: f } = useIntl();
  const [createWork] = useMutation(CREATE_WORK);

  const onSubmit = async (event, work) => {
    event.preventDefault();

    await createWork({
      variables: { ...work },
      refetchQueries: [
        {
          query: FETCH_WORKS
        }
      ]
    });

    history.push('/admincp/work/manage');
  };

  return (
    <>
      <Container>
        <MetaTagCreate />
        <div style={{ marginTop: '1rem' }}>
          <ButtonLink to={'/admincp/work/manage'}>
            <FontAwesomeIcon icon="arrow-left" />{' '}
            {f({ id: 'go_back', defaultMessage: 'Go back' })}
          </ButtonLink>
        </div>
        <Card>
          <h4>
            {f({ id: 'create', defaultMessage: 'Create' })}{' '}
            {f({ id: 'work', defaultMessage: 'Work' })}
          </h4>
          <div>
            <WorkForm
              work={postEmpty}
              onSubmit={onSubmit}
              onCreatePersonModal={toggleCreatePersonModal}
            />
          </div>
        </Card>
      </Container>
      <CreatePersonModal
        isOpen={isCreatePersonModal}
        toggleModal={toggleCreatePersonModal}
      />
    </>
  );
}

export default CreateWork;
