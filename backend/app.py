from flask import Flask, jsonify, request
from models import MemoryGame

app = Flask(__name__)
game = MemoryGame()

@app.route('/initialize', methods=['GET'])
def initialize_game():
    game.shuffle_cards()
    game.current_turn = 1
    game.flips_this_turn = 0
    game.scores = [0,0]
    game.card1 = None
    game.card2 = None  
    return jsonify(game.get_game_state())

@app.route('/turn', methods=['POST'])
def handle_turn():
    data = request.get_json()
    card_id = data['card_id']
    if game.flips_this_turn == 0:
        handle_first_flip(card_id)
    elif game.flips_this_turn == 1:
        handle_second_flip(card_id)
        scores = check_match()  # Ensure scores are updated here
        game.card1 = None
        game.card2 = None
        response = jsonify({
            "success": True, 
            "current_turn": game.current_turn,  # This will still show Player 1
            "flips_this_turn": game.flips_this_turn,
            "scores": scores  # Use updated scores
        })
        toggle_player_turn()  # Toggle the turn after sending the response
        return response
    # Response for the first flip
    return jsonify({
        "success": True, 
        "current_turn": game.current_turn,
        "flips_this_turn": game.flips_this_turn,
        "scores": game.scores
    })

def handle_first_flip(card_id):
    print(f'card1 id: {card_id}')
    game.card1 = card_id
    game.flips_this_turn = 1

def handle_second_flip(card_id):
    print(f'card2 id: {card_id}')
    game.card2 = card_id
    game.flips_this_turn = 2

def check_match():
    print(f'Card1: {game.cards[game.card1]}')
    print(f'Card2: {game.cards[game.card2]}')
    if game.cards[game.card1] == game.cards[game.card2]:
        print('congrats!')
        if game.current_turn == 1:
            game.scores[0] += 10
        elif game.current_turn == 2:
            game.scores[1] += 10
    return game.scores

def toggle_player_turn():
    game.current_turn = 2 if game.current_turn == 1 else 1
    game.flips_this_turn = 0

if __name__ == '__main__':
    app.run(debug=True)