import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ScrollView,
  Image,
  Alert,
  Dimensions,
  KeyboardAvoidingView,
  Platform
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import * as ImagePicker from 'expo-image-picker';
import { ChallengeCard } from '../../../../types/challenge';
import { Colors } from '../../../../constants/Colors';

const { width } = Dimensions.get('window');

interface Props {
  challenge: ChallengeCard;
  participationType: 'individual' | 'team';
  onSubmit: (submission: ChallengeSubmission) => void;
  onClose: () => void;
}

export interface ChallengeSubmission {
  id: string;
  challengeId: number;
  challengeTitle: string;
  challengeIcon: string;
  text: string;
  image?: string;
  timestamp: Date;
  author: {
    name: string;
    avatar: string;
    username: string;
  };
  likes: number;
  comments: number;
  shares: number;
  participationType: 'individual' | 'team';
}

// Challenge theme configurations
const getChallengeTheme = (challengeTitle: string) => {
  const title = challengeTitle.toLowerCase();
  
  if (title.includes('peace') || title.includes('meditation') || title.includes('mindful')) {
    return {
      submitTitle: 'Share Your Peaceful Moment',
      inputLabel: 'Describe your peaceful experience',
      placeholder: 'Tell the community about your peaceful moment... How did it make you feel?',
      individualTips: '• Share what brought you inner peace\n• Describe the emotions you felt\n• Inspire others to find their own calm',
      teamTips: '• Share how your team found peace together\n• Describe your collective experience\n• Inspire other groups to find harmony'
    };
  } else if (title.includes('adventure') || title.includes('explore') || title.includes('journey')) {
    return {
      submitTitle: 'Share Your Adventure',
      inputLabel: 'Tell us about your adventure',
      placeholder: 'Share your exciting adventure... What made it memorable?',
      individualTips: '• Describe the highlights of your journey\n• Share what you discovered about yourself\n• Inspire others to explore new horizons',
      teamTips: '• Share how your team conquered the adventure\n• Describe your teamwork moments\n• Inspire other groups to explore together'
    };
  } else if (title.includes('gratitude') || title.includes('thankful') || title.includes('appreciate')) {
    return {
      submitTitle: 'Share What You\'re Grateful For',
      inputLabel: 'Express your gratitude',
      placeholder: 'Share what filled your heart with gratitude today...',
      individualTips: '• Reflect on what truly matters to you\n• Share specific moments of appreciation\n• Inspire others to find gratitude in their lives',
      teamTips: '• Share what your team is collectively grateful for\n• Describe moments of shared appreciation\n• Inspire other groups to practice gratitude together'
    };
  } else if (title.includes('creative') || title.includes('art') || title.includes('create')) {
    return {
      submitTitle: 'Share Your Creative Expression',
      inputLabel: 'Describe your creative process',
      placeholder: 'Tell us about your creative journey... What inspired you?',
      individualTips: '• Share your creative inspiration\n• Describe your artistic process\n• Inspire others to express their creativity',
      teamTips: '• Share how your team created together\n• Describe your collaborative process\n• Inspire other groups to create as one'
    };
  } else if (title.includes('fitness') || title.includes('workout') || title.includes('health')) {
    return {
      submitTitle: 'Share Your Wellness Journey',
      inputLabel: 'Describe your wellness experience',
      placeholder: 'Tell us about your wellness moment... How did it energize you?',
      individualTips: '• Share how this boosted your wellbeing\n• Describe the energy you gained\n• Inspire others to prioritize their health',
      teamTips: '• Share how your team motivated each other\n• Describe your collective energy\n• Inspire other groups to get active together'
    };
  } else {
    return {
      submitTitle: 'Share Your Experience',
      inputLabel: 'Tell us about your experience',
      placeholder: 'Share your meaningful moment with the community...',
      individualTips: '• Share what made this moment special\n• Describe how it impacted you\n• Inspire others to try this challenge',
      teamTips: '• Share how your team experienced this together\n• Describe your collective journey\n• Inspire other groups to join the challenge'
    };
  }
};

export function ChallengeSubmissionPage({ challenge, participationType, onSubmit, onClose }: Props) {
  const [text, setText] = useState('');
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const theme = getChallengeTheme(challenge.title);

  const pickImage = async () => {
    const permissionResult = await ImagePicker.requestMediaLibraryPermissionsAsync();
    
    if (permissionResult.granted === false) {
      Alert.alert('Permission needed', 'Permission to access camera roll is required!');
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [1, 1],
      quality: 0.8,
    });

    if (!result.canceled) {
      setSelectedImage(result.assets[0].uri);
    }
  };

  const takePhoto = async () => {
    const permissionResult = await ImagePicker.requestCameraPermissionsAsync();
    
    if (permissionResult.granted === false) {
      Alert.alert('Permission needed', 'Camera permission is required!');
      return;
    }

    const result = await ImagePicker.launchCameraAsync({
      allowsEditing: true,
      aspect: [1, 1],
      quality: 0.8,
    });

    if (!result.canceled) {
      setSelectedImage(result.assets[0].uri);
    }
  };

  const handleSubmit = async () => {
    if (!text.trim() && !selectedImage) {
      Alert.alert('Empty post', 'Please add some text or an image to share your moment.');
      return;
    }

    setIsSubmitting(true);

    try {
      const submission: ChallengeSubmission = {
        id: Date.now().toString(),
        challengeId: challenge.id,
        challengeTitle: challenge.title,
        challengeIcon: challenge.image,
        text: text.trim(),
        image: selectedImage || undefined,
        timestamp: new Date(),
        author: {
          name: 'You',
          avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&h=100&fit=crop&crop=face',
          username: '@you'
        },
        likes: 0,
        comments: 0,
        shares: 0,
        participationType: participationType
      };

      await new Promise(resolve => setTimeout(resolve, 1000)); // Simulate API call
      onSubmit(submission);
      Alert.alert('Success!', 'Your moment has been shared with the community! ✨');
      onClose();
    } catch (error) {
      Alert.alert('Error', 'Failed to submit your post. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <KeyboardAvoidingView 
      className="flex-1" 
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      style={{ backgroundColor: Colors.default.bg }}
    >
      {/* Header */}
      <View className="flex-row items-center justify-between px-4 py-3 pt-12">
        <TouchableOpacity onPress={onClose} className="p-2">
          <Ionicons name="close" size={24} color={Colors.default.textPrimary} />
        </TouchableOpacity>
        <Text className="text-lg font-semibold" style={{ color: Colors.default.textPrimary }}>
          {theme.submitTitle}
        </Text>
        <TouchableOpacity
          onPress={handleSubmit}
          disabled={isSubmitting}
          className="px-4 py-2 rounded-full"
          style={{ 
            backgroundColor: challenge.gradient[0],
            opacity: isSubmitting ? 0.6 : 1
          }}
        >
          <Text className="text-white font-semibold">
            {isSubmitting ? 'Sharing...' : 'Share'}
          </Text>
        </TouchableOpacity>
      </View>

      <ScrollView className="flex-1" showsVerticalScrollIndicator={false}>
        {/* Challenge Info */}
        <View className="mx-4 mb-6">
          <LinearGradient
            colors={[challenge.gradient[0], challenge.gradient[1]]}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            className="rounded-2xl p-4"
          >
            <View className="flex-row items-center">
              <View 
                className="w-12 h-12 rounded-xl items-center justify-center mr-3"
                style={{ backgroundColor: 'rgba(255, 255, 255, 0.2)' }}
              >
                <Text style={{ fontSize: 24 }}>{challenge.image}</Text>
              </View>
              <View className="flex-1">
                <Text className="text-white text-lg font-bold">{challenge.title}</Text>
                <Text className="text-white/90 text-sm">
                  {challenge.subtitle} • {participationType} participation
                </Text>
              </View>
            </View>
          </LinearGradient>
        </View>

        {/* Content Input */}
        <View className="mx-4 mb-6">
          <Text 
            className="text-base font-medium mb-3"
            style={{ color: Colors.default.textPrimary }}
          >
            {theme.inputLabel}
          </Text>
          <TextInput
            value={text}
            onChangeText={setText}
            placeholder={theme.placeholder}
            placeholderTextColor={Colors.default.textSecondary}
            multiline
            textAlignVertical="top"
            className="p-4 rounded-2xl text-base"
            style={{
              backgroundColor: Colors.default.cardBg,
              color: Colors.default.textPrimary,
              minHeight: 120,
              maxHeight: 200
            }}
          />
        </View>

        {/* Image Preview */}
        {selectedImage && (
          <View className="mx-4 mb-6">
            <View className="relative">
              <Image
                source={{ uri: selectedImage }}
                className="w-full h-64 rounded-2xl"
                resizeMode="cover"
              />
              <TouchableOpacity
                onPress={() => setSelectedImage(null)}
                className="absolute top-2 right-2 w-8 h-8 rounded-full items-center justify-center"
                style={{ backgroundColor: 'rgba(0, 0, 0, 0.5)' }}
              >
                <Ionicons name="close" size={16} color="white" />
              </TouchableOpacity>
            </View>
          </View>
        )}

        {/* Media Options */}
        <View className="mx-4 mb-6">
          <Text 
            className="text-base font-medium mb-3"
            style={{ color: Colors.default.textPrimary }}
          >
            Add a photo (optional)
          </Text>
          <View className="flex-row space-x-3">
            <TouchableOpacity
              onPress={takePhoto}
              className="flex-1 flex-row items-center justify-center p-4 rounded-2xl"
              style={{ backgroundColor: Colors.default.cardBg }}
            >
              <Ionicons 
                name="camera" 
                size={20} 
                color={Colors.default.textPrimary} 
                style={{ marginRight: 8 }}
              />
              <Text style={{ color: Colors.default.textPrimary }}>Camera</Text>
            </TouchableOpacity>
            
            <TouchableOpacity
              onPress={pickImage}
              className="flex-1 flex-row items-center justify-center p-4 rounded-2xl"
              style={{ backgroundColor: Colors.default.cardBg }}
            >
              <Ionicons 
                name="images" 
                size={20} 
                color={Colors.default.textPrimary}
                style={{ marginRight: 8 }}
              />
              <Text style={{ color: Colors.default.textPrimary }}>Gallery</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Themed Tips */}
        <View className="mx-4 mb-8">
          <View 
            className="p-4 rounded-2xl"
            style={{ backgroundColor: `${challenge.gradient[0]}20` }}
          >
            <Text 
              className="text-sm font-medium mb-2"
              style={{ color: challenge.gradient[0] }}
            >
              💡 Tips for a great {participationType} post:
            </Text>
            <Text 
              className="text-sm"
              style={{ color: Colors.default.textSecondary }}
            >
              {participationType === 'individual' ? theme.individualTips : theme.teamTips}
            </Text>
          </View>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}