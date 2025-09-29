import { Platform, Dimensions } from 'react-native';

const isTV = Platform.isTV
const isAndroid = Platform.OS === 'android'
const isWeb = Platform.OS === 'web'
const isPortrait = Dimensions.get('window').width < Dimensions.get('window').height
import _ from 'lodash'

let scaleMultiplier = 0.75

if (isTV) {
    scaleMultiplier = 0.5
}

const scaled = (input) => {
    return Math.round(input * scaleMultiplier)
}

export function getWindowHeight() {
    return Dimensions.get('window').height
}

export function getWindowWidth() {
    return Dimensions.get('window').width
}

export function createStyle(overrides) {
    let AppStyle = {
        color: {
            background: 'black',
            text: 'rgb(235, 235, 235)',
            textDark: 'rgb(22, 22, 22)',
            active: 'rgb(150, 150, 150)',
            hover: 'rgb(119, 139, 255)',
            core: 'rgb(219, 158, 44)',
            coreDark: 'rgb(136, 98, 27)',
            outlineDark: 'rgb(63, 63, 63)',
            fade: 'rgb(23, 23, 23)',
            transparentDark: 'rgba(0,0,0,0.6)',
            panel: 'rgb(50, 50, 50)',
        },
        fontSize: {
            header: 40,
            label: 26
        },
        surface: {
            uhd: {
                width: 3840,
                height: 2160
            },
            fhd: {
                width: 1920,
                height: 1080
            }
        },
        button: {
            borderRadius: 6
        },
        imageButton: {
            wrapper: {
                normal: {
                    height: scaled(425),
                    width: scaled(310)
                },
                wide: {
                    height: scaled(280),
                    width: scaled(310)
                },
                square: {
                    height: scaled(250),
                    width: scaled(250)
                }
            },
            image: {
                normal: {
                    height: scaled(315),
                    width: scaled(260)
                },
                wide: {
                    height: scaled(165),
                    width: scaled(260)
                },
                square: {
                    height: scaled(200),
                    width: scaled(200)
                }
            },
            fontSize: {
                normal: scaled(25),
                small: scaled(20)
            },
            textBox: {
                marginTop: isAndroid ? -10 : 0
            }
        },
        textButton: {
            wrapper: {
                normal: {
                    height: 35
                }
            },
            fontSize: {
                normal: 16,
                small: 12
            },
            textBox: {
                height: isAndroid ? 25 : 15
            }
        },
        rangeSlider: {
            borderRadius: 16,
            thumbSize: 60,
            trackSize: 30
        }
    }
    if (overrides) {
        // Apply color overrides before generating the rest of the style
        AppStyle = _.merge({}, AppStyle, overrides)
    }


    AppStyle.component = {
        break: {
            borderBottomColor: AppStyle.color.coreDark,
            borderBottomWidth: 2,
        },
        fillView: {
            default: {
                flex: 1
            },
            flexStart: {
                justifyContent: 'flex-start'
            }
        },
        grid: {
            list: {
                justifyContent: 'space-evenly'
            },
            short: {
                padding: 0
            }
        },
        header: {
            fontSize: AppStyle.fontSize.header,
            color: AppStyle.color.text,
            margin: 10,
            padding: 10
        },
        imageButton: {
            wrapper: {
                height: AppStyle.imageButton.wrapper.normal.height,
                width: AppStyle.imageButton.wrapper.normal.width,
                margin: 10,
                marginLeft: 'auto',
                marginRight: 'auto',
                borderColor: AppStyle.color.background,
                borderWidth: AppStyle.button.borderRadius,
                outlineStyle: 'none', // Disable web default white outline on focused element
                outline: 'none', // Disable web default white outline on focused element
            },
            wrapperWide: {
                height: AppStyle.imageButton.wrapper.wide.height,
                width: AppStyle.imageButton.wrapper.wide.width,
            },
            wrapperSquare: {
                height: AppStyle.imageButton.wrapper.square.height,
                width: AppStyle.imageButton.wrapper.square.width
            },
            selected: {
                borderColor: AppStyle.color.active
            },
            focused: {
                borderColor: AppStyle.color.hover
            },
            dull: {
                backgroundColor: AppStyle.color.coreDark,
                borderColor: AppStyle.color.coreDark,
            },
            image: {
                height: AppStyle.imageButton.image.normal.height,
                width: AppStyle.imageButton.image.normal.width,
                marginTop: 5,
                paddingBottom: 5,
                marginLeft: 'auto',
                marginRight: 'auto'
            },
            imageWide: {
                height: AppStyle.imageButton.image.wide.height,
                width: AppStyle.imageButton.image.wide.width,
            },
            imageSquare: {
                height: AppStyle.imageButton.image.square.height,
                width: AppStyle.imageButton.image.square.width,
            },
            text: {
                height: 25,
                color: AppStyle.color.textDark,
                fontSize: AppStyle.imageButton.fontSize.normal,
                fontWeight: 'bold',
                padding: 0,
                margin: 0,
                textAlign: 'center'
            },
            smallText: {
                fontSize: AppStyle.imageButton.fontSize.small
            },
            textWrapper: {
                marginLeft: 'auto',
                marginRight: 'auto',
                marginTop: 5,
                width: '100%',
                height: 41,
                backgroundColor: AppStyle.color.core,
                borderColor: AppStyle.color.core,
                borderRadius: AppStyle.button.borderRadius,
                justifyContent: 'center',
                alignItems: 'center',
                padding: 2
            }
        },
        input: {
            text: {
                borderWidth: 2,
                borderColor: AppStyle.color.coreDark,
                backgroundColor: AppStyle.color.core,
                color: AppStyle.color.text,
                margin: 10,
                padding: 10,
                outlineStyle: 'none', // Disable web default white outline on focused element
                outline: 'none', // Disable web default white outline on focused element
            },
            small: {
                margin: 1,
                padding: 1,
                fontSize: 10
            },
            focused: {
                borderColor: AppStyle.color.hover
            },
        },
        label: {
            fontSize: AppStyle.fontSize.label,
            color: AppStyle.color.text,
            margin: 10,
            padding: 10
        },
        modal: {
            prompt: {
                backgroundColor: AppStyle.color.background
            },
            transparent: {
                backgroundColor: AppStyle.color.transparentDark
            },
            center: {
                justifyContent: 'center',
                alignItems: 'center',
                textAlign: 'center'
            }
        },
        rangeSlider: {
            wrapper: {
                alignItems: "center",
                marginVertical: AppStyle.rangeSlider.trackSize
            },
            trackWrapper: {
                height: AppStyle.rangeSlider.trackSize,
                borderRadius: AppStyle.rangeSlider.borderRadius,
                flexDirection: "row",
                alignItems: "center",
                backgroundColor: "transparent",
                width: 400
            },
            leftTrack: {
                height: "100%",
                borderTopLeftRadius: AppStyle.rangeSlider.borderRadius,
                borderBottomLeftRadius: AppStyle.rangeSlider.borderRadius,
                backgroundColor: AppStyle.color.coreDark
            },
            rightTrack: {
                flex: 1,
                height: "100%",
                borderTopRightRadius: AppStyle.rangeSlider.borderRadius,
                borderBottomRightRadius: AppStyle.rangeSlider.borderRadius,
                backgroundColor: AppStyle.color.outlineDark
            },
            thumb: {
                position: "absolute",
                width: AppStyle.rangeSlider.thumbSize,
                height: AppStyle.rangeSlider.thumbSize,
                borderRadius: AppStyle.rangeSlider.thumbSize / 2,
                borderWidth: 4,
                backgroundColor: AppStyle.color.core,
                borderColor: AppStyle.color.coreDark
            }
        },
        safeArea: {
            padding: 30,
            backgroundColor: AppStyle.color.background,
            flex: 1
        },
        tabs: {
            panel: {
                backgroundColor: AppStyle.color.panel,
                marginTop: isWeb ? -16 : -18,
                borderRadius: AppStyle.button.borderRadius,
                borderWidth: 1,
                borderColor: 'transparent',
                paddingTop: 30,
                paddingBottom: 30
            }
        },
        textButton: {
            wrapper: {
                margin: 10,
                padding: 10,
                height: AppStyle.textButton.wrapper.normal.height,
                justifyContent: 'center', // Horizontally center each line
                alignItems: 'center', // Vertically center each line
                alignContent: 'center', // Multiline vertical center of parent
                textAlign: 'center', // Ensure text objects are horizontally centered
                backgroundColor: AppStyle.color.core,
                borderWidth: AppStyle.button.borderRadius,
                borderColor: AppStyle.color.core,
                borderRadius: AppStyle.button.borderRadius,
                outlineStyle: 'none', // Disable web default white outline on focused element
                outline: 'none', // Disable web default white outline on focused element
            },
            tallWrapper: {
                height: 80,
                padding: 0
            },
            shortWrapper: {
                height: 10,
                margin: 1
            },
            selected: {
                borderColor: AppStyle.color.active
            },
            focused: {
                borderColor: AppStyle.color.hover
            },
            disabled: {
                opacity: 0.5
            },
            fade: {
                backgroundColor: AppStyle.color.fade
            },
            text: {
                color: AppStyle.color.textDark,
                fontSize: AppStyle.textButton.fontSize.normal,
                padding: 0,
                margin: 0,
                textAlign: 'center',
                height: AppStyle.textButton.textBox.height
            },
            smallText: {
                fontSize: AppStyle.textButton.fontSize.small
            },
            fadeText: {

            }
        },
        text: {
            text: {
                color: AppStyle.color.text
            },
            normal: {
                margin: 10,
                padding: 10
            },
            normal: {
                margin: 10,
                padding: 10
            },
            center: {
                width: '100%',
                alignItems: 'center'
            },
            noSelect: {
                noSelect: {
                    userSelect: 'none',
                    WebkitUserSelect: 'none',
                    MozUserSelect: 'none',
                    msUserSelect: 'none',
                }
            }
        },
        toggle: {
            center: {
                flex: 1,
                display: 'flex',
                marginLeft: 'auto',
                marginRight: 'auto',
                marginBottom: 30,
                outlineStyle: 'none', // Disable web default white outline on focused element
                outline: 'none', // Disable web default white outline on focused element
            },
            color: {
                true: AppStyle.color.coreDark,
                false: AppStyle.color.outlineDark,
                thumb: AppStyle.color.core
            }
        }
    }

    AppStyle.isTV = isTV
    AppStyle.isWeb = isWeb
    AppStyle.isAndroid = isAndroid
    AppStyle.isPortrait = isPortrait

    if (overrides) {
        AppStyle = _.merge({}, AppStyle, overrides)
    }

    return AppStyle
}
