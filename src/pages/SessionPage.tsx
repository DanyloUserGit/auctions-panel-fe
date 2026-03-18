import { useTabsStore } from '../features/sessions/model/useTabsStore';
import { SessionContainer } from '../features/sessions/ui/SessionContainer';
import Tabs from '../shared/ui/Tabs';

export default function SessionPage() {
  const { tabs } = useTabsStore();
  return (
    <>
      {tabs.length ? <Tabs /> : <></>}
      <SessionContainer />
    </>
  );
}
