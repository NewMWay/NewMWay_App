/* eslint-disable react-native/no-inline-styles */
import { StyleSheet, Text, View, TouchableOpacity, Image, Animated, LayoutAnimation, Platform, UIManager, Vibration, useWindowDimensions } from 'react-native'
import React, { useState, useRef, useEffect, useMemo } from 'react'
import { ifTablet } from '../../../utils/responsives/responsive'
import { Colors } from '../../../assets/styles/colorStyles'
import RenderHtml from 'react-native-render-html';

interface DescriptionProps {
    description: string;
    maxLines?: number;
    scrollRef?: React.RefObject<any>;
}

const LINE_HEIGHT = ifTablet(22, 18);

const Description = ({ description, maxLines = 4, scrollRef }: DescriptionProps) => {
    const chevronIcon = require('../../../assets/icons/icons8-collapse-arrow-48.png');
    const { width } = useWindowDimensions(); 

    const [isExpanded, setIsExpanded] = useState(false);
    const [showReadMore, setShowReadMore] = useState(false);

    const [contentHeight, setContentHeight] = useState(0);

    const rotateAnim = useRef(new Animated.Value(0)).current;
    const scaleAnim = useRef(new Animated.Value(1)).current;
    const componentRef = useRef<View>(null);

    const collapsedHeight = maxLines * LINE_HEIGHT;

    useEffect(() => {
        if (Platform.OS === 'android') {
            if (UIManager.setLayoutAnimationEnabledExperimental) {
                UIManager.setLayoutAnimationEnabledExperimental(true);
            }
        }
    }, []);

    const toggleExpanded = () => {
        if (Platform.OS === 'ios') {
            Vibration.vibrate(10);
        }

        Animated.sequence([
            Animated.timing(scaleAnim, {
                toValue: 0.95,
            duration: 100,
                useNativeDriver: true,
            }),
            Animated.spring(scaleAnim, {
                toValue: 1,
                useNativeDriver: true,
                tension: 300,
                friction: 10,
            })
        ]).start();

        if (componentRef.current && scrollRef?.current) {
            componentRef.current.measureInWindow((x, y, _width, _height) => {
                const currentScrollY = y;

                LayoutAnimation.configureNext({
                    duration: 400,
                    create: { type: LayoutAnimation.Types.spring, property: LayoutAnimation.Properties.opacity, springDamping: 0.8 },
                    update: { type: LayoutAnimation.Types.spring, property: LayoutAnimation.Properties.scaleXY, springDamping: 0.8 },
                });

                const toValue = isExpanded ? 0 : 1;
                Animated.spring(rotateAnim, {
                    toValue,
                    useNativeDriver: true,
                    tension: 200,
                    friction: 8,
                }).start();

                setIsExpanded(!isExpanded);

                setTimeout(() => {
                    if (componentRef.current && scrollRef?.current) {
                        componentRef.current.measureLayout(
                            scrollRef.current as any,
                            (left, top, __width, __height) => {
                                const scrollOffset = !isExpanded ? 60 : 120;
                                const targetY = Math.max(0, top - scrollOffset);
                                scrollRef.current.scrollTo({ y: targetY, animated: true });
                            },
                            () => {
                                const fallbackOffset = !isExpanded ? 50 : 80;
                                scrollRef.current.scrollTo({ y: Math.max(0, currentScrollY - fallbackOffset), animated: true });
                            }
                        );
                    }
                }, 200);
            });
        } else {
            LayoutAnimation.configureNext({
                duration: 400,
                create: { type: LayoutAnimation.Types.spring, property: LayoutAnimation.Properties.opacity, springDamping: 0.8 },
                update: { type: LayoutAnimation.Types.spring, property: LayoutAnimation.Properties.scaleXY, springDamping: 0.8 },
            });

            const toValue = isExpanded ? 0 : 1;
            Animated.spring(rotateAnim, {
                toValue,
                useNativeDriver: true,
                tension: 200,
                friction: 8,
            }).start();

            setIsExpanded(!isExpanded);
        }
    };

    const rotation = rotateAnim.interpolate({
        inputRange: [0, 1],
        outputRange: ['0deg', '180deg'],
    });


    const onContentLayout = (event: any) => {
        const { height } = event.nativeEvent.layout;
        if (Math.abs(contentHeight - height) > 1) {
            setContentHeight(height);
            if (height > collapsedHeight) {
                setShowReadMore(true);
            } else {
                setShowReadMore(false);
            }
        }
    };

    // Tái sử dụng style cho RenderHtml - memoize để tránh re-render
    const tagsStyles = useMemo(() => ({
        body: {
            fontSize: ifTablet(14, 12),
            fontFamily: 'Sora-Regular',
            color: Colors.textDark,
            lineHeight: LINE_HEIGHT, // Quan trọng: Phải khớp với tính toán
            textAlign: 'justify' as const,
            margin: 0,
            padding: 0
        },
        p: {
            margin: 0, // Reset margin mặc định của thẻ p để tính toán chiều cao chính xác hơn
            marginBottom: 8
        }
    }), []);

    const htmlSource = useMemo(() => ({ html: description }), [description]);

    const contentWidth = useMemo(() => width - (ifTablet(16, 12) * 2 + ifTablet(12, 8) * 2), [width]);

    return (
        <View ref={componentRef} style={styles.container}>
            <View style={styles.headerContainer}>
                <Text style={styles.titleText}>Mô tả sản phẩm</Text>
            </View>

            <View style={styles.contentContainer}>
                <View style={{
                    height: isExpanded ? undefined : (showReadMore ? collapsedHeight : undefined),
                    overflow: 'hidden', 
                }}>
                    <View onLayout={onContentLayout}>
                        <RenderHtml
                            contentWidth={contentWidth} 
                            source={htmlSource}
                            tagsStyles={tagsStyles}                        
                        />
                    </View>
                </View>

                {showReadMore && (
                    <View style={styles.buttonContainer}>
                        {!isExpanded && (
                            <View
                                style={styles.fadeOverlay}
                            />
                        )}

                        <Animated.View style={{ transform: [{ scale: scaleAnim }] }}>
                            <TouchableOpacity
                                onPress={toggleExpanded}
                                style={styles.readMoreButton}
                                activeOpacity={0.9}
                            >
                                <Text style={styles.readMoreText}>
                                    {isExpanded ? 'Thu gọn' : 'Xem thêm'}
                                </Text>
                                <Animated.View style={{ transform: [{ rotate: rotation }] }}>
                                    <Image
                                        source={chevronIcon}
                                        style={styles.chevronIcon}
                                    />
                                </Animated.View>
                            </TouchableOpacity>
                        </Animated.View>
                    </View>
                )}
            </View>
        </View>
    )
}

export default Description

const styles = StyleSheet.create({
    container: {
        backgroundColor: 'white',
        borderRadius: ifTablet(12, 8),
        padding: ifTablet(16, 12),
        marginVertical: ifTablet(8, 6),
        borderWidth: 1,
        borderColor: '#F0F0F0',
    },
    headerContainer: {
        paddingBottom: ifTablet(12, 8),
        borderBottomWidth: 0.5,
        borderBottomColor: '#E0E0E0',
        marginBottom: ifTablet(12, 8),
    },
    titleText: {
        fontSize: ifTablet(16, 14),
        fontFamily: 'Sora-SemiBold',
        fontWeight: '600',
        color: Colors.textDark,
    },
    contentContainer: {

    },
    // descriptionText: Đã chuyển thành tagsStyles trong component
    buttonContainer: {
        alignItems: 'center',
        marginTop: ifTablet(16, 12),
    },
    readMoreButton: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingVertical: ifTablet(12, 10),
        paddingHorizontal: ifTablet(20, 16),
        borderRadius: ifTablet(30, 25),
        backgroundColor: 'white',
        borderWidth: 1.5,
        borderColor: Colors.primary,
        shadowColor: Colors.primary,
        shadowOffset: {
            width: 0,
            height: 4,
        },
        shadowOpacity: 0.15,
        shadowRadius: 8,
        elevation: 8,
    },
    readMoreText: {
        fontSize: ifTablet(14, 12),
        fontFamily: 'Sora-SemiBold',
        fontWeight: '600',
        color: Colors.primary,
        marginRight: ifTablet(8, 6),
    },
    chevronIcon: {
        width: ifTablet(16, 14),
        height: ifTablet(16, 14),
        tintColor: Colors.primary,
    },
    fadeOverlay: {
        position: 'absolute',
        top: -30,
        left: 0,
        right: 0,
        height: 30,
    }
})