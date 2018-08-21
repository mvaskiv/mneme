import Fab from 'native-base';
import { MaterialIcons } from '@expo/vector-icons';

export default RecoverBtn = ({onPress}) => (
    <Fab
        direction="up"
        containerStyle={{ }}
        style={{ backgroundColor: 'rgba(22,22,22,0.53)' }}
        position="bottomLeft"
        onPress={onPress}>
        <Icon.MaterialIcons name={'restore'} />
    </Fab>
  );