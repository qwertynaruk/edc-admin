import { LostFoundItemDetailPage } from 'features/lost-found';

import { useParams } from 'react-router-dom';

export default function LostFoundDetailPage() {
  const { id } = useParams();

  return <LostFoundItemDetailPage pageId={id} />;
}
