import { StyleSheet } from "react-native"

export const style = ():ReturnType<typeof StyleSheet.create> => {
    return(
        {
          navigation: {
            display: 'flex',
            gap: 1,
            flexDirection: 'row',
            justifyContent: 'center',
            backgroundColor: 'black'
          },
          link: {
            marginTop: '.5%',
            padding: '2%',
            textAlign: 'center',
            color: 'white',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            width: '50%',
            backgroundColor: 'rgb(50,50,50)',
            fontWeight: 500,
            textTransform: 'uppercase',
            fontSize: 15
          }
        }
    )
}