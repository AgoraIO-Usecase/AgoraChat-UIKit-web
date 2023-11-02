Compare UIKit 2.0 and 1.0

1. More versatile UI style 2.0: After redesign, the UI style has become more versatile and suitable for more scenarios 1.0: Purple gradient bubbles, random image avatars are not universal enough

2. More components 2.0:

   - Container components: `UIKitProvider`, `ConversationList`.
   - Module components: `BaseMessage`, `AudioMessage`, `FileMessage`， `VideoMessage`, `ImageMessage`, `TextMessage`, `Header`, `Empty`, `MessageList`, `ConversationItem`, `MessageEditor`, `MessageStatus`.
   - Pure UI components: `Avatar`, `Badge`, `Button`, `Checkbox`, `Icon`, `Modal`, `Tooltip`. 1.0: `ChatApp`, `EaseChat`

3. Support for more languages 2.0: By default, it supports Chinese and English, and can be expanded to any language on its own 1.0: Supports Chinese, English, and cannot be extended to other languages

4. More convenient to modify styles 2.0:

   - Each component is styled through class style
   - Modifying themes through variables defined by scss coverage
   - Fixed class, can find element override styles
   - Configure global primary color

     1.0: No ability to modify styles provided, only source code can be modified

5. Support for more custom functions 2.0: Most of the content can be customized through the `renderX` method of different components 1.0: Only supports custom header

6. More detailed documentation 2.0: Multiple documents are provided to explain how to quickly start, customize, and provide a storybook to explain the usage of each component 1.0: Only one document

7. Support Typescript

   - 1.0: javascript
   - 2.0: typescript

8. Provides richer functionality

Added functions such as translation, merging and forwarding, multiple selection and deletion, editing after sending, and referencing

9. More flexible features selection
   which can globally configure which features are needed
